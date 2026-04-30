import { z } from "zod";

export const addCardSchema = z.object({
  cardOwner: z.string().min(1, "Enter the card owner name").max(200),
  cardNumber: z.string().regex(/^\d{13,16}$/, "Invalid card number"),
  cardLastFour: z.string().regex(/^\d{4}$/, "Invalid card number"),
  cardBrand: z.string().nullable().optional().default(null),
  cardExpMonth: z
    .number()
    .int()
    .min(1, "Invalid expiry month")
    .max(12, "Invalid expiry month"),
  cardExpYear: z
    .number()
    .int()
    .min(new Date().getFullYear(), "Card has expired"),
  existingBillingAddressId: z.number().int().optional(),
  billingLine1: z.string().optional(),
  billingLine2: z.string().nullable().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingPostal: z.string().optional(),
  billingCountry: z.string().optional(),
});

export const removeCardSchema = z.object({
  id: z.string().min(1, "Invalid card id"),
});
