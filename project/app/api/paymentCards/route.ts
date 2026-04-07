import { auth } from "@/auth";
import { encryptCard } from "@/lib/security";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getUserType } from "@/lib/repositories/userRepository";
import {
  countPaymentCards,
  verifyAddressOwnership,
  insertBillingAddress,
  insertPaymentCard,
} from "@/lib/repositories/paymentRepository";

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

  // Verify the user is a customer
  const userType = await getUserType(userId);
  if (userType !== "CUSTOMER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Enforce 3-card limit
  const cardCount = await countPaymentCards(userId);
  if (cardCount >= 3) {
    return NextResponse.json(
      { error: "You can save a maximum of 3 payment cards" },
      { status: 422 },
    );
  }

  let billingAddressId: number | null = null;

  if (typeof existingBillingAddressId === "number") {
    const owns = await verifyAddressOwnership(existingBillingAddressId, userId);
    if (owns) billingAddressId = existingBillingAddressId;
  } else if (typeof billingLine1 === "string" && billingLine1.trim()) {
    const country =
      typeof billingCountry === "string"
        ? billingCountry.toUpperCase().slice(0, 2) || "US"
        : "US";
    billingAddressId = await insertBillingAddress(userId, {
      line1: billingLine1.trim(),
      line2:
        typeof billingLine2 === "string" && billingLine2.trim()
          ? billingLine2.trim()
          : null,
      city: typeof billingCity === "string" ? billingCity.trim() : "",
      state: typeof billingState === "string" ? billingState.trim() : "",
      postal: typeof billingPostal === "string" ? billingPostal.trim() : "",
      country,
    });
  }

  await insertPaymentCard({
    id: randomUUID(),
    userId,
    billingAddressId,
    cardLastFour: cardLastFour as string,
    cardBrand: typeof cardBrand === "string" && cardBrand ? cardBrand : null,
    cardExpMonth: month,
    cardExpYear: year,
    encryptedCardNumber: encryptCard(cardNumber),
  });

  return NextResponse.json({ success: true });
}
