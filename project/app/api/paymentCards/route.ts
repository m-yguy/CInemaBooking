import { auth } from "@/auth";
import { sql } from "@/lib/db";
import { encryptCard } from "@/lib/security";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

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
  const userRows = await sql`
    SELECT user_type FROM users WHERE user_id = ${userId} LIMIT 1
  `;
  if (userRows[0]?.user_type !== "CUSTOMER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Enforce 3-card limit
  const countRows = await sql`
    SELECT COUNT(*) AS count FROM public.payment_method WHERE customer_id = ${userId}
  `;
  if (Number(countRows[0]?.count) >= 3) {
    return NextResponse.json(
      { error: "You can save a maximum of 3 payment cards" },
      { status: 422 },
    );
  }

  let billingAddressId: number | null = null;

  if (typeof existingBillingAddressId === "number") {
    // Verify the address belongs to this customer before linking
    const addrRows = await sql`
      SELECT id FROM public.mailing_address
      WHERE id = ${existingBillingAddressId} AND customer_id = ${userId}
      LIMIT 1
    `;
    if (addrRows.length > 0) billingAddressId = existingBillingAddressId;
  } else if (typeof billingLine1 === "string" && billingLine1.trim()) {
    const country =
      typeof billingCountry === "string"
        ? billingCountry.toUpperCase().slice(0, 2) || "US"
        : "US";
    const [row] = await sql`
      INSERT INTO public.mailing_address
        (customer_id, address_line_1, address_line_2, city, state, postal_code, country)
      VALUES (
        ${userId},
        ${billingLine1.trim()},
        ${typeof billingLine2 === "string" && billingLine2.trim() ? billingLine2.trim() : null},
        ${typeof billingCity === "string" ? billingCity.trim() : ""},
        ${typeof billingState === "string" ? billingState.trim() : ""},
        ${typeof billingPostal === "string" ? billingPostal.trim() : ""},
        ${country}
      )
      RETURNING id
    `;
    billingAddressId = row.id;
  }

  const id = randomUUID();
  const encryptedCardNumber = encryptCard(cardNumber);
  await sql`
    INSERT INTO public.payment_method
      (id, customer_id, billing_address_id, card_last_four, card_brand, card_exp_month, card_exp_year, card_number_encrypted)
    VALUES (
      ${id},
      ${userId},
      ${billingAddressId},
      ${cardLastFour},
      ${typeof cardBrand === "string" && cardBrand ? cardBrand : null},
      ${month},
      ${year},
      ${encryptedCardNumber}
    )
  `;

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

  await sql`
    DELETE FROM public.payment_method
    WHERE id = ${id} AND customer_id = ${userId}
  `;

  return NextResponse.json({ success: true });
}
