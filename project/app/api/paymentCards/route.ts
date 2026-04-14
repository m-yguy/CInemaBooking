import { auth } from "@/auth";
import { NextResponse } from "next/server";
import * as paymentService from "@/lib/services/paymentService";
import type { AddCardInput } from "@/lib/services/paymentService";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const {
    cardNumber,
    cardLastFour,
    cardBrand,
    cardExpMonth,
    cardExpYear,
    existingBillingAddressId,
    billingLine1,
    billingLine2,
    billingCity,
    billingState,
    billingPostal,
    billingCountry,
  } = body as Record<string, unknown>;

  if (typeof cardNumber !== "string" || !/^\d{13,16}$/.test(cardNumber)) {
    return NextResponse.json({ error: "Invalid card number" }, { status: 400 });
  }

  if (typeof cardLastFour !== "string" || !/^\d{4}$/.test(cardLastFour)) {
    return NextResponse.json({ error: "Invalid card number" }, { status: 400 });
  }

  const month = Number(cardExpMonth);
  const year = Number(cardExpYear);
  if (
    !month ||
    month < 1 ||
    month > 12 ||
    !year ||
    year < new Date().getFullYear()
  ) {
    return NextResponse.json({ error: "Invalid expiry date" }, { status: 400 });
  }

  const input: AddCardInput = {
    cardNumber,
    cardLastFour,
    cardBrand: typeof cardBrand === "string" && cardBrand ? cardBrand : null,
    cardExpMonth: month,
    cardExpYear: year,
    existingBillingAddressId:
      typeof existingBillingAddressId === "number"
        ? existingBillingAddressId
        : undefined,
    billingLine1: typeof billingLine1 === "string" ? billingLine1 : undefined,
    billingLine2: typeof billingLine2 === "string" ? billingLine2 : undefined,
    billingCity: typeof billingCity === "string" ? billingCity : undefined,
    billingState: typeof billingState === "string" ? billingState : undefined,
    billingPostal:
      typeof billingPostal === "string" ? billingPostal : undefined,
    billingCountry:
      typeof billingCountry === "string" ? billingCountry : undefined,
  };

  const result = await paymentService.addCard(userId, input);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { id } = body as Record<string, unknown>;

  if (typeof id !== "string" || !id.trim()) {
    return NextResponse.json({ error: "Invalid card id" }, { status: 400 });
  }

  const result = await paymentService.removeCard(id.trim(), userId);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({ success: true });
}
