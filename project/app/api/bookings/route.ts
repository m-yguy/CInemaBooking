import { NextResponse } from "next/server";
import { sendBookingConfirmationEmail } from "@/lib/mail";
import { createOrder } from "@/lib/services/bookingService";
import { auth } from "@/auth";
import * as paymentService from "@/lib/services/paymentService";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const payload = await req.json();

    const email = payload?.email;
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { ok: false, error: "Email is required" },
        { status: 400 },
      );
    }

    if (!session?.user?.id) {
      return NextResponse.json(
        { ok: false, error: "You must be signed in to book." },
        { status: 401 },
      );
    }

    const selectedSeats = Array.isArray(payload.selectedSeats)
      ? payload.selectedSeats
      : [];

    const quantities = payload.quantities ?? {
      adult: 0,
      child: 0,
      senior: 0,
    };

    const paymentMethod = payload.paymentMethod ?? { type: "new" };

    const orderId = await createOrder({
      customerId: session.user.id,
      showId: payload.showId ?? null,
      movieTitle: payload.title,
      showTime: payload.time,
      selectedSeats,
      quantities,
      originalTotal: Number(payload.originalTotal ?? payload.total ?? 0),
      discountAmount: Number(payload.discountAmount ?? 0),
      finalTotal: Number(payload.total ?? 0),
      promoCode: payload.promoCode ?? null,
      paymentType: paymentMethod.type === "saved" ? "saved" : "new",
      cardLastFour: paymentMethod.cardLastFour ?? null,
      confirmationEmail: email,
    });

    if (
      paymentMethod.type === "new" &&
      payload.paymentMethod?.saveCard &&
      typeof payload.paymentMethod.cardOwner === "string"
    ) {
      try {
        await paymentService.addCard(session.user.id, {
          cardOwner: payload.paymentMethod.cardOwner,
          cardNumber: String(payload.paymentMethod.cardNumber ?? "").replace(
            /\s/g,
            "",
          ),
          cardLastFour: String(payload.paymentMethod.cardLastFour ?? "").slice(
            -4,
          ),
          cardBrand: payload.paymentMethod.cardBrand ?? null,
          cardExpMonth: Number(payload.paymentMethod.cardExpMonth ?? 0),
          cardExpYear: Number(payload.paymentMethod.cardExpYear ?? 0),
        });
      } catch (err) {
        console.warn("Booking completed but failed to save payment card:", err);
      }
    }

    const firstName =
      payload.firstName ||
      payload.first_name ||
      session.user.first_name ||
      "Valued Customer";

    const booking = {
      title: payload.title,
      time: payload.time,
      selectedSeats,
      quantities,
      total: Number(payload.total ?? 0),
      posterUrl: payload.posterUrl,
      showId: payload.showId,
    };

    await sendBookingConfirmationEmail(email, firstName, booking);

    return NextResponse.json({ ok: true, orderId });
  } catch (err) {
    console.error("Failed to create booking:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
