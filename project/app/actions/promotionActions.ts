"use server";

import { auth } from "@/auth";
import {
  createPromotion,
  getAllPromotions,
  getSubscribedUserEmails,
  type Promotion,
} from "@/lib/repositories/promotionRepository";
import { sendPromotionEmail } from "@/lib/mail";

const DISCOUNT_TYPES = ["PERCENTAGE", "FLAT"] as const;
const STATUSES = ["ACTIVE", "INACTIVE"] as const;

export interface AddPromotionInput {
  promoCode: string;
  title: string;
  description: string;
  discountType: string;
  discountAmount: string;
  startDate: string;
  endDate: string;
  status: string;
}

function validatePromotion(data: AddPromotionInput): string | null {
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

export async function addPromotionAction(
  data: AddPromotionInput,
): Promise<{ error: string } | { success: true; promoId: number }> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Forbidden" };
  }

  const validationError = validatePromotion(data);
  if (validationError) return { error: validationError };

  try {
    const promoId = await createPromotion({
      promoCode: data.promoCode.trim().toUpperCase(),
      title: data.title.trim(),
      description: data.description.trim(),
      discountType: data.discountType as "PERCENTAGE" | "FLAT",
      discountAmount: parseFloat(data.discountAmount),
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status as "ACTIVE" | "INACTIVE",
    });
    return { success: true, promoId };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("promotions_promo_code_key")) {
      return { error: "A promotion with that promo code already exists." };
    }
    return { error: "Failed to create promotion. Please try again." };
  }
}

export async function sendPromotionEmailsAction(
  promoId: number,
): Promise<{ error: string } | { success: true; sent: number }> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Forbidden" };
  }

  // Re-fetch the promotion so we have authoritative data
  const { getAllPromotions } =
    await import("@/lib/repositories/promotionRepository");
  const all = await getAllPromotions();
  const promo = all.find((p) => p.promo_id === promoId);
  if (!promo) return { error: "Promotion not found." };
  if (promo.status !== "ACTIVE")
    return { error: "Only ACTIVE promotions can be sent." };

  const subscribers = await getSubscribedUserEmails();
  if (subscribers.length === 0) return { success: true, sent: 0 };

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

  return { success: true, sent: subscribers.length };
}

export async function getPromotionsAction(): Promise<
  { error: string } | { success: true; promotions: Promotion[] }
> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Forbidden" };
  }
  const promotions = await getAllPromotions();
  return { success: true, promotions };
}
