jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/repositories/promotionRepository");
jest.mock("@/lib/mail");

import {
  addPromotionAction,
  sendPromotionEmailsAction,
  getPromotionsAction,
  type AddPromotionInput,
} from "@/app/actions/promotionActions";
import { auth } from "@/auth";
import * as promotionRepo from "@/lib/repositories/promotionRepository";
import * as mail from "@/lib/mail";

const mockAuth = auth as jest.Mock;
const mockCreatePromotion = promotionRepo.createPromotion as jest.Mock;
const mockGetAllPromotions = promotionRepo.getAllPromotions as jest.Mock;
const mockGetSubscribedUserEmails =
  promotionRepo.getSubscribedUserEmails as jest.Mock;
const mockSendPromotionEmail = mail.sendPromotionEmail as jest.Mock;

const adminSession = { user: { id: "admin-1", role: "ADMIN" } };

const validPromo: AddPromotionInput = {
  promoCode: "SUMMER10",
  title: "Summer Sale",
  description: "10% off all tickets",
  discountType: "PERCENTAGE",
  discountAmount: "10",
  startDate: "2026-06-01",
  endDate: "2026-08-31",
  status: "ACTIVE",
};

// ---------------------------------------------------------------------------
// addPromotionAction
// ---------------------------------------------------------------------------
describe("addPromotionAction", () => {
  it("returns Forbidden when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    expect(await addPromotionAction(validPromo)).toEqual({
      error: "Forbidden",
    });
  });

  it("returns Forbidden for non-ADMIN role", async () => {
    mockAuth.mockResolvedValue({ user: { role: "CUSTOMER" } });
    expect(await addPromotionAction(validPromo)).toEqual({
      error: "Forbidden",
    });
  });

  it("returns error when promo code is empty", async () => {
    mockAuth.mockResolvedValue(adminSession);
    expect(await addPromotionAction({ ...validPromo, promoCode: "" })).toEqual({
      error: "Promo code is required.",
    });
  });

  it("returns error when promo code exceeds 50 characters", async () => {
    mockAuth.mockResolvedValue(adminSession);
    expect(
      await addPromotionAction({ ...validPromo, promoCode: "A".repeat(51) }),
    ).toEqual({ error: "Promo code must be 50 characters or fewer." });
  });

  it("returns error when promo code has invalid characters", async () => {
    mockAuth.mockResolvedValue(adminSession);
    expect(
      await addPromotionAction({ ...validPromo, promoCode: "PROMO CODE!" }),
    ).toEqual({
      error:
        "Promo code may only contain letters, numbers, hyphens, and underscores.",
    });
  });

  it("returns error when title is empty", async () => {
    mockAuth.mockResolvedValue(adminSession);
    expect(await addPromotionAction({ ...validPromo, title: "" })).toEqual({
      error: "Title is required.",
    });
  });

  it("returns error for invalid discount type", async () => {
    mockAuth.mockResolvedValue(adminSession);
    expect(
      await addPromotionAction({ ...validPromo, discountType: "HALF" }),
    ).toEqual({ error: "Invalid discount type." });
  });

  it("returns error when discount amount is not positive", async () => {
    mockAuth.mockResolvedValue(adminSession);
    expect(
      await addPromotionAction({ ...validPromo, discountAmount: "-5" }),
    ).toEqual({ error: "Discount amount must be a positive number." });
  });

  it("returns error when percentage discount exceeds 100", async () => {
    mockAuth.mockResolvedValue(adminSession);
    expect(
      await addPromotionAction({ ...validPromo, discountAmount: "110" }),
    ).toEqual({ error: "Percentage discount cannot exceed 100." });
  });

  it("allows FLAT discount greater than 100", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockCreatePromotion.mockResolvedValue(3);
    expect(
      await addPromotionAction({
        ...validPromo,
        discountType: "FLAT",
        discountAmount: "150",
      }),
    ).toEqual({ success: true, promoId: 3 });
  });

  it("returns error when end date is before start date", async () => {
    mockAuth.mockResolvedValue(adminSession);
    expect(
      await addPromotionAction({ ...validPromo, endDate: "2026-01-01" }),
    ).toEqual({ error: "End date must be on or after the start date." });
  });

  it("returns error for invalid status", async () => {
    mockAuth.mockResolvedValue(adminSession);
    expect(
      await addPromotionAction({ ...validPromo, status: "EXPIRED" }),
    ).toEqual({ error: "Invalid status." });
  });

  it("returns success on valid input", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockCreatePromotion.mockResolvedValue(7);
    expect(await addPromotionAction(validPromo)).toEqual({
      success: true,
      promoId: 7,
    });
  });

  it("returns duplicate promo code error on unique constraint violation", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockCreatePromotion.mockRejectedValue(
      new Error("promotions_promo_code_key duplicate"),
    );
    expect(await addPromotionAction(validPromo)).toEqual({
      error: "A promotion with that promo code already exists.",
    });
  });
});

// ---------------------------------------------------------------------------
// sendPromotionEmailsAction
// ---------------------------------------------------------------------------
describe("sendPromotionEmailsAction", () => {
  it("returns Forbidden when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    expect(await sendPromotionEmailsAction(1)).toEqual({ error: "Forbidden" });
  });

  it("returns error when promotion is not found", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockGetAllPromotions.mockResolvedValue([]);
    expect(await sendPromotionEmailsAction(99)).toEqual({
      error: "Promotion not found.",
    });
  });

  it("returns error when promotion is not ACTIVE", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockGetAllPromotions.mockResolvedValue([
      { promo_id: 1, status: "INACTIVE" },
    ]);
    expect(await sendPromotionEmailsAction(1)).toEqual({
      error: "Only ACTIVE promotions can be sent.",
    });
  });

  it("returns sent: 0 when no subscribers exist", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockGetAllPromotions.mockResolvedValue([
      {
        promo_id: 1,
        status: "ACTIVE",
        title: "T",
        description: "D",
        promo_code: "CODE",
        discount_type: "FLAT",
        discount_amount: 5,
        start_date: "2026-06-01",
        end_date: "2026-08-31",
      },
    ]);
    mockGetSubscribedUserEmails.mockResolvedValue([]);
    expect(await sendPromotionEmailsAction(1)).toEqual({
      success: true,
      sent: 0,
    });
    expect(mockSendPromotionEmail).not.toHaveBeenCalled();
  });

  it("sends emails to all subscribers and returns count", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockGetAllPromotions.mockResolvedValue([
      {
        promo_id: 1,
        status: "ACTIVE",
        title: "T",
        description: "D",
        promo_code: "CODE",
        discount_type: "FLAT",
        discount_amount: 5,
        start_date: "2026-06-01",
        end_date: "2026-08-31",
      },
    ]);
    mockGetSubscribedUserEmails.mockResolvedValue([
      { email: "a@b.com", first_name: "Alice" },
      { email: "c@d.com", first_name: "Carol" },
    ]);
    mockSendPromotionEmail.mockResolvedValue(undefined);
    expect(await sendPromotionEmailsAction(1)).toEqual({
      success: true,
      sent: 2,
    });
    expect(mockSendPromotionEmail).toHaveBeenCalledTimes(2);
  });
});

// ---------------------------------------------------------------------------
// getPromotionsAction
// ---------------------------------------------------------------------------
describe("getPromotionsAction", () => {
  it("returns Forbidden when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    expect(await getPromotionsAction()).toEqual({ error: "Forbidden" });
  });

  it("returns Forbidden for non-ADMIN role", async () => {
    mockAuth.mockResolvedValue({ user: { role: "CUSTOMER" } });
    expect(await getPromotionsAction()).toEqual({ error: "Forbidden" });
  });

  it("returns all promotions for ADMIN", async () => {
    mockAuth.mockResolvedValue(adminSession);
    const fakePromotions = [{ promo_id: 1 }, { promo_id: 2 }];
    mockGetAllPromotions.mockResolvedValue(fakePromotions);
    expect(await getPromotionsAction()).toEqual({
      success: true,
      promotions: fakePromotions,
    });
  });
});
