import { randomUUID } from "crypto";
import { encryptCard } from "@/lib/securityFacade";
import {
  getPaymentCards,
  countPaymentCards,
  getBillingAddressById,
  updateBillingAddress,
  insertBillingAddress,
  insertPaymentCard,
  deletePaymentCard,
  type PaymentCard,
} from "@/lib/repositories/paymentRepository";
export type { PaymentCard };

export interface AddCardInput {
  cardOwner: string;
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
  | {
      ok: false;
      error: string;
      status: number;
      requiredFields?: string[];
    };

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

  const billingLine1 = input.billingLine1?.trim() ?? "";
  const billingCity = input.billingCity?.trim() ?? "";
  const billingState = input.billingState?.trim() ?? "";
  const billingPostal = input.billingPostal?.trim() ?? "";
  const billingCountry = input.billingCountry?.trim() ?? "";
  const addressEntered =
    !!billingLine1 ||
    !!billingCity ||
    !!billingState ||
    !!billingPostal ||
    !!billingCountry;
  const addressComplete =
    !!billingLine1 &&
    !!billingCity &&
    !!billingState &&
    !!billingPostal &&
    !!billingCountry;

  if (addressEntered && !addressComplete) {
    const missingFields = [
      billingLine1 ? null : "billingLine1",
      billingCity ? null : "billingCity",
      billingState ? null : "billingState",
      billingPostal ? null : "billingPostal",
      billingCountry ? null : "billingCountry",
    ].filter(Boolean) as string[];
    return {
      ok: false,
      error: "Fill out all required fields. *",
      status: 422,
      requiredFields: missingFields,
    };
  }

  if (typeof input.existingBillingAddressId === "number") {
    const existingAddress = await getBillingAddressById(
      input.existingBillingAddressId,
      userId,
    );

    if (existingAddress) {
      if (addressEntered) {
        if (existingAddress.line1?.trim()) {
          return {
            ok: false,
            error:
              "A mailing address is already saved. Use your existing address or update it from your profile.",
            status: 422,
          };
        }

        await updateBillingAddress(input.existingBillingAddressId, userId, {
          line1: billingLine1,
          line2: input.billingLine2?.trim() ?? null,
          city: billingCity,
          state: billingState,
          postal: billingPostal,
          country: billingCountry
            ? billingCountry.toUpperCase().slice(0, 2) || "US"
            : "US",
        });
      }

      billingAddressId = input.existingBillingAddressId;
    }
  } else if (billingLine1) {
    const country = billingCountry
      ? billingCountry.toUpperCase().slice(0, 2) || "US"
      : "US";
    billingAddressId = await insertBillingAddress(userId, {
      line1: billingLine1,
      line2: input.billingLine2?.trim() ?? null,
      city: billingCity,
      state: billingState,
      postal: billingPostal,
      country,
    });
  }

  await insertPaymentCard({
    id: randomUUID(),
    userId,
    billingAddressId,
    cardOwner: input.cardOwner.trim(),
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
