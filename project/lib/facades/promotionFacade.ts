import {
  getPromotionById,
  getSubscribedUserEmails,
} from "@/lib/repositories/promotionRepository";
import { sendPromotionEmail } from "@/lib/mail";

export class PromotionFacade {
  async sendPromotionEmails(
    promotionId: number,
  ): Promise<{ ok: true; sent: number } | { ok: false; error: string }> {
    const promo = await getPromotionById(promotionId);
    if (!promo) return { ok: false, error: "Promotion not found." };
    if (promo.status !== "ACTIVE") {
      return { ok: false, error: "Only ACTIVE promotions can be sent." };
    }

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
}

export const promotionFacade = new PromotionFacade();
