import {
  getAllPromotions,
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

/** Facade: return all promotions. */
export async function listPromotions(): Promise<Promotion[]> {
  return getAllPromotions();
}

/** Facade: persist a new promotion; maps DB constraint violations to domain errors. */
export async function addPromotion(
  data: AddPromotionInput,
): Promise<{ ok: true; promoId: number } | { ok: false; error: string }> {
  try {
    const promoId = await createPromotion(data);
    return { ok: true, promoId };
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

/** Facade: look up promo, fetch subscribers, dispatch emails, return sent count. */
export async function sendPromotionEmails(
  promoId: number,
): Promise<{ ok: true; sent: number } | { ok: false; error: string }> {
  const all = await getAllPromotions();
  const promo = all.find((p) => p.promo_id === promoId);
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
