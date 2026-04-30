import { NextResponse } from "next/server";
import { validatePromotion } from "@/lib/services/promotionService";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const promoCode = body?.promoCode;
    const orderTotal = body?.orderTotal;

    if (!promoCode || typeof promoCode !== "string") {
      return NextResponse.json(
        { ok: false, error: "Promo code is required." },
        { status: 400 },
      );
    }

    if (typeof orderTotal !== "number" || orderTotal < 0) {
      return NextResponse.json(
        { ok: false, error: "Valid order total is required." },
        { status: 400 },
      );
    }

    const result = await validatePromotion(promoCode, orderTotal);

    return NextResponse.json(result, {
      status: result.ok ? 200 : 400,
    });
  } catch (err) {
    console.error("Failed to validate promo code:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to validate promo code." },
      { status: 500 },
    );
  }
}