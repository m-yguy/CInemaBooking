import { sql } from "@/lib/db";

export interface PaymentCard {
  id: string;
  cardBrand: string | null;
  cardLastFour: string;
  cardExpMonth: number;
  cardExpYear: number;
}

export async function getPaymentCards(userId: string): Promise<PaymentCard[]> {
  const rows = await sql`
    SELECT id, card_brand, card_last_four, card_exp_month, card_exp_year
    FROM public.payment_method
    WHERE customer_id = ${userId}
    ORDER BY created_at ASC
  `;
  return rows.map((r) => ({
    id: String(r.id),
    cardBrand: (r.card_brand as string | null) ?? null,
    cardLastFour: String(r.card_last_four).trim(),
    cardExpMonth: Number(r.card_exp_month),
    cardExpYear: Number(r.card_exp_year),
  }));
}

export async function countPaymentCards(userId: string): Promise<number> {
  const rows = await sql`
    SELECT COUNT(*) AS count FROM public.payment_method WHERE customer_id = ${userId}
  `;
  return Number(rows[0]?.count ?? 0);
}

export async function verifyAddressOwnership(
  addressId: number,
  userId: string,
): Promise<boolean> {
  const rows = await sql`
    SELECT id FROM public.mailing_address
    WHERE id = ${addressId} AND customer_id = ${userId}
    LIMIT 1
  `;
  return rows.length > 0;
}

export async function insertBillingAddress(
  userId: string,
  data: {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postal: string;
    country: string;
  },
): Promise<number> {
  const [row] = await sql`
    INSERT INTO public.mailing_address
      (customer_id, address_line_1, address_line_2, city, state, postal_code, country)
    VALUES (
      ${userId},
      ${data.line1},
      ${data.line2},
      ${data.city},
      ${data.state},
      ${data.postal},
      ${data.country}
    )
    RETURNING id
  `;
  return row.id as number;
}

export async function insertPaymentCard(data: {
  id: string;
  userId: string;
  billingAddressId: number | null;
  cardLastFour: string;
  cardBrand: string | null;
  cardExpMonth: number;
  cardExpYear: number;
  encryptedCardNumber: string;
}) {
  await sql`
    INSERT INTO public.payment_method
      (id, customer_id, billing_address_id, card_last_four, card_brand, card_exp_month, card_exp_year, card_number_encrypted)
    VALUES (
      ${data.id},
      ${data.userId},
      ${data.billingAddressId},
      ${data.cardLastFour},
      ${data.cardBrand},
      ${data.cardExpMonth},
      ${data.cardExpYear},
      ${data.encryptedCardNumber}
    )
  `;
}

export async function deletePaymentCard(
  id: string,
  userId: string,
): Promise<void> {
  await sql`
    DELETE FROM public.payment_method
    WHERE id = ${id} AND customer_id = ${userId}
  `;
}
