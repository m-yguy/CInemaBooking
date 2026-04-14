import { randomUUID } from "crypto";
import { encryptCard } from "@/lib/security";
import {
  getPaymentCards,
  countPaymentCards,
  verifyAddressOwnership,
  insertBillingAddress,
  insertPaymentCard,
  deletePaymentCard,
  type PaymentCard,
} from "@/lib/repositories/paymentRepository";
export type { PaymentCard };

export interface AddCardInput {
  cardNumber: string;
  cardLastFour: string;
  cardBrand: string | null;
  cardExpMonth: number;
  cardExpYear: number;
  existingBillingAddressId?: number;
  billingLine1?: string;
  billingLine2?: string | null;
  billingCity?: string;
  billingState?: string;
  billingPostal?: string;
  billingCountry?: string;
}

export type ServiceResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; status: number };

export async function getCards(userId: string): Promise<PaymentCard[]> {
  return getPaymentCards(userId);
}

export async function addCard(
  userId: string,
  input: AddCardInput,
): Promise<ServiceResult> {
  const cardCount = await countPaymentCards(userId);
  if (cardCount >= 3) {
    return {
      ok: false,
      error: "You can save a maximum of 3 payment cards",
      status: 422,
    };
  }

  let billingAddressId: number | null = null;

  if (typeof input.existingBillingAddressId === "number") {
    const owns = await verifyAddressOwnership(
      input.existingBillingAddressId,
      userId,
    );
    if (owns) billingAddressId = input.existingBillingAddressId;
  } else if (input.billingLine1?.trim()) {
    const country = input.billingCountry
      ? input.billingCountry.toUpperCase().slice(0, 2) || "US"
      : "US";
    billingAddressId = await insertBillingAddress(userId, {
      line1: input.billingLine1.trim(),
      line2: input.billingLine2?.trim() ?? null,
      city: input.billingCity?.trim() ?? "",
      state: input.billingState?.trim() ?? "",
      postal: input.billingPostal?.trim() ?? "",
      country,
    });
  }

  await insertPaymentCard({
    id: randomUUID(),
    userId,
    billingAddressId,
    cardLastFour: input.cardLastFour,
    cardBrand: input.cardBrand ?? null,
    cardExpMonth: input.cardExpMonth,
    cardExpYear: input.cardExpYear,
    encryptedCardNumber: encryptCard(input.cardNumber),
  });

  return { ok: true, data: undefined };
}

export async function removeCard(
  cardId: string,
  userId: string,
): Promise<ServiceResult> {
  await deletePaymentCard(cardId, userId);
  return { ok: true, data: undefined };
}
