import {
  getAllPromotions,
  getPromotionById,
  createPromotion,
  getSubscribedUserEmails,
  type Promotion,
} from "@/lib/repositories/promotionRepository";
import { sendPromotionEmail } from "@/lib/mail";

export type { Promotion };

export interface AddPromotionInput {
  promoCode: string;
  title: string;
  description: string;
  discountType: "PERCENTAGE" | "FLAT";
  discountAmount: number;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "INACTIVE";
}

export async function listPromotions(): Promise<Promotion[]> {
  return getAllPromotions();
}

export async function addPromotion(
  data: AddPromotionInput,
): Promise<{ ok: true; promotionId: number } | { ok: false; error: string }> {
  try {
    const promotionId = await createPromotion(data);
    return { ok: true, promotionId };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("promotions_promo_code_key")) {
      return {
        ok: false,
        error: "A promotion with that promo code already exists.",
      };
    }
    throw err;
  }
}

export async function sendPromotionEmails(
  promotionId: number,
): Promise<{ ok: true; sent: number } | { ok: false; error: string }> {
  const promo = await getPromotionById(promotionId);
  if (!promo) return { ok: false, error: "Promotion not found." };
  if (promo.status !== "ACTIVE")
    return { ok: false, error: "Only ACTIVE promotions can be sent." };

  const subscribers = await getSubscribedUserEmails();
  if (subscribers.length === 0) return { ok: true, sent: 0 };

  await Promise.all(
    subscribers.map((u) =>
      sendPromotionEmail(u.email, u.first_name ?? "Valued Customer", {
        title: promo.title,
        description: promo.description,
        promoCode: promo.promo_code,
        discountType: promo.discount_type,
        discountAmount: promo.discount_amount,
        startDate: promo.start_date,
        endDate: promo.end_date,
      }),
    ),
  );
  return { ok: true, sent: subscribers.length };
}
