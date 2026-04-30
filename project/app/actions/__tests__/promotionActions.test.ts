jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/services/promotionService");
jest.mock("@/lib/facades/promotionFacade");

import {
  addPromotionAction,
  sendPromotionEmailsAction,
  getPromotionsAction,
  type PromotionFormData,
} from "@/app/actions/promotionActions";
import { auth } from "@/auth";

const mockAuth = auth as jest.Mock;
const promotionService = jest.requireMock(
  "@/lib/services/promotionService",
) as {
  addPromotion: jest.Mock;
  listPromotions: jest.Mock;
};
const promotionFacade = jest.requireMock("@/lib/facades/promotionFacade") as {
  promotionFacade: {
    sendPromotionEmails: jest.Mock;
  };
};
const mockCreatePromotion = promotionService.addPromotion as jest.Mock;
const mockGetAllPromotions = promotionService.listPromotions as jest.Mock;
const mockSendPromotionEmails = promotionFacade.promotionFacade
  .sendPromotionEmails as jest.Mock;

const adminSession = { user: { id: "admin-1", role: "ADMIN" } };

const validPromo: PromotionFormData = {
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
    ).toEqual({ success: true, promotionId: 3 });
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
      promotionId: 7,
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
    mockSendPromotionEmails.mockResolvedValue({
      ok: false,
      error: "Promotion not found.",
    });
    expect(await sendPromotionEmailsAction(99)).toEqual({
      error: "Promotion not found.",
    });
  });

  it("returns error when promotion is not ACTIVE", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockSendPromotionEmails.mockResolvedValue({
      ok: false,
      error: "Only ACTIVE promotions can be sent.",
    });
    expect(await sendPromotionEmailsAction(1)).toEqual({
      error: "Only ACTIVE promotions can be sent.",
    });
  });

  it("returns sent: 0 when no subscribers exist", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockSendPromotionEmails.mockResolvedValue({ ok: true, sent: 0 });
    expect(await sendPromotionEmailsAction(1)).toEqual({
      success: true,
      sent: 0,
    });
  });

  it("sends emails and returns count", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockSendPromotionEmails.mockResolvedValue({ ok: true, sent: 2 });
    expect(await sendPromotionEmailsAction(1)).toEqual({
      success: true,
      sent: 2,
    });
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
