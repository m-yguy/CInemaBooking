import {
  getAllPromotions,
  createPromotion,
  getPromotionByCode,
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

export async function validatePromotion(
  promoCode: string,
  orderTotal: number,
): Promise<
  | {
      ok: true;
      promoCode: string;
      discountAmount: number;
      finalTotal: number;
      message: string;
    }
  | { ok: false; error: string }
> {
  const promotion = await getPromotionByCode(promoCode.trim());

  if (!promotion) {
    return { ok: false, error: "Invalid promo code." };
  }

  if (promotion.status !== "ACTIVE") {
    return { ok: false, error: "This promo code is not active." };
  }

  const today = new Date();
  const startDate = new Date(promotion.start_date);
  const endDate = new Date(promotion.end_date);

  if (today < startDate || today > endDate) {
    return { ok: false, error: "This promo code is expired or not active yet." };
  }

  let discountAmount = 0;

  if (promotion.discount_type === "PERCENTAGE") {
    discountAmount = orderTotal * (Number(promotion.discount_amount) / 100);
  } else {
    discountAmount = Number(promotion.discount_amount);
  }

  discountAmount = Math.min(discountAmount, orderTotal);
  const finalTotal = Math.max(orderTotal - discountAmount, 0);

  return {
    ok: true,
    promoCode: promotion.promo_code,
    discountAmount: Number(discountAmount.toFixed(2)),
    finalTotal: Number(finalTotal.toFixed(2)),
    message: `Promo code ${promotion.promo_code} applied.`,
  };
}
