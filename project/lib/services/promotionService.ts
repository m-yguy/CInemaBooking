import {
  getAllPromotions,
  createPromotion,
  type Promotion,
} from "@/lib/repositories/promotionRepository";

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
