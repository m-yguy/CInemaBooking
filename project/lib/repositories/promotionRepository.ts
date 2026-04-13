import { sql } from "@/lib/db";

export interface Promotion {
  promo_id: number;
  promo_code: string;
  title: string;
  description: string;
  discount_type: "PERCENTAGE" | "FLAT";
  discount_amount: number;
  start_date: string;
  end_date: string;
  status: "ACTIVE" | "INACTIVE";
}

export async function getAllPromotions(): Promise<Promotion[]> {
  const rows = await sql`
    SELECT promo_id, promo_code, title, description,
           discount_type, discount_amount, start_date, end_date, status
    FROM public.promotions
    ORDER BY promo_id DESC
  `;
  return rows as Promotion[];
}

export async function createPromotion(data: {
  promoCode: string;
  title: string;
  description: string;
  discountType: "PERCENTAGE" | "FLAT";
  discountAmount: number;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "INACTIVE";
}): Promise<number> {
  const rows = await sql`
    INSERT INTO public.promotions
      (promo_code, title, description, discount_type, discount_amount,
       start_date, end_date, status)
    VALUES (
      ${data.promoCode}, ${data.title}, ${data.description},
      ${data.discountType}, ${data.discountAmount},
      ${data.startDate}::date, ${data.endDate}::date,
      ${data.status}
    )
    RETURNING promo_id
  `;
  return rows[0].promo_id as number;
}

export async function getSubscribedUserEmails(): Promise<
  { email: string; first_name: string }[]
> {
  const rows = await sql`
    SELECT email, first_name
    FROM public.users
    WHERE receives_promos = true AND verified = true
  `;
  return rows as { email: string; first_name: string }[];
}
