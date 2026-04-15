"use server";

import * as promotionService from "@/lib/services/promotionService";
import { withAuthAdmin } from "@/lib/middleware/withAuthDecorator";

export type { Promotion } from "@/lib/services/promotionService";

const DISCOUNT_TYPES = ["PERCENTAGE", "FLAT"] as const;
const STATUSES = ["ACTIVE", "INACTIVE"] as const;

export interface PromotionFormData {
  promoCode: string;
  title: string;
  description: string;
  discountType: string;
  discountAmount: string;
  startDate: string;
  endDate: string;
  status: string;
}

function validatePromotion(data: PromotionFormData): string | null {
  if (!data.promoCode.trim()) return "Promo code is required.";
  if (data.promoCode.trim().length > 50)
    return "Promo code must be 50 characters or fewer.";
  if (!/^[A-Za-z0-9_-]+$/.test(data.promoCode.trim()))
    return "Promo code may only contain letters, numbers, hyphens, and underscores.";

  if (!data.title.trim()) return "Title is required.";
  if (data.title.trim().length > 200)
    return "Title must be 200 characters or fewer.";

  if (!(DISCOUNT_TYPES as readonly string[]).includes(data.discountType))
    return "Invalid discount type.";

  const amount = parseFloat(data.discountAmount);
  if (isNaN(amount) || amount <= 0)
    return "Discount amount must be a positive number.";
  if (data.discountType === "PERCENTAGE" && amount > 100)
    return "Percentage discount cannot exceed 100.";

  if (!data.startDate) return "Start date is required.";
  if (!data.endDate) return "End date is required.";
  if (data.endDate < data.startDate)
    return "End date must be on or after the start date.";

  if (!(STATUSES as readonly string[]).includes(data.status))
    return "Invalid status.";

  return null;
}

export const addPromotionAction = withAuthAdmin(
  async (
    _session,
    data: PromotionFormData,
  ): Promise<{ error: string } | { success: true; promotionId: number }> => {
    const validationError = validatePromotion(data);
    if (validationError) return { error: validationError };

    try {
      const result = await promotionService.addPromotion({
        promoCode: data.promoCode.trim().toUpperCase(),
        title: data.title.trim(),
        description: data.description.trim(),
        discountType: data.discountType as "PERCENTAGE" | "FLAT",
        discountAmount: parseFloat(data.discountAmount),
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status as "ACTIVE" | "INACTIVE",
      });
      if (!result.ok) return { error: result.error };
      return { success: true, promotionId: result.promotionId };
    } catch {
      return { error: "Failed to create promotion. Please try again." };
    }
  },
);

export const sendPromotionEmailsAction = withAuthAdmin(
  async (
    _session,
    promotionId: number,
  ): Promise<{ error: string } | { success: true; sent: number }> => {
    const result = await promotionService.sendPromotionEmails(promotionId);
    if (!result.ok) return { error: result.error };
    return { success: true, sent: result.sent };
  },
);

export const getPromotionsAction = withAuthAdmin(
  async (
    _session,
  ): Promise<
    | { error: string }
    | { success: true; promotions: promotionService.Promotion[] }
  > => {
    const promotions = await promotionService.listPromotions();
    return { success: true, promotions };
  },
);
