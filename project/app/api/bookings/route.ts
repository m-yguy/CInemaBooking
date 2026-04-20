import { NextResponse } from "next/server";
import { sendBookingConfirmationEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const email = payload?.email;
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { ok: false, error: "Email is required" },
        { status: 400 },
      );
    }

    const firstName =
      payload.firstName ||
      payload.first_name ||
      (typeof payload.name === "string"
        ? payload.name.split(" ")[0]
        : "Valued Customer");

    const booking = {
      title: payload.title,
      time: payload.time,
      selectedSeats: payload.selectedSeats,
      quantities: payload.quantities,
      total: payload.total,
    };

    await sendBookingConfirmationEmail(email, firstName, booking);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to send booking confirmation email:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
