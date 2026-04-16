jest.mock("@/auth", () => ({ auth: jest.fn(), signOut: jest.fn() }));
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));
jest.mock("next/navigation", () => ({ redirect: jest.fn() }));

jest.mock("@/lib/facades/userAccountFacade", () => ({
  userAccountFacade: {
    updateProfile: jest.fn(),
    changePassword: jest.fn(),
    removeFavorite: jest.fn(),
  },
}));

import {
  changePassword,
  removeFavoriteAction,
  updateProfile,
} from "@/app/actions/accountActions";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { userAccountFacade } from "@/lib/facades/userAccountFacade";

const mockAuth = auth as jest.Mock;
const mockFacade = userAccountFacade as jest.Mocked<typeof userAccountFacade>;

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  return fd;
}

const fakeSession = { user: { id: "user-1", role: "CUSTOMER" } };

describe("account actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("changePassword", () => {
    it("returns error when not authenticated", async () => {
      mockAuth.mockResolvedValue(null);
      const result = await changePassword(makeFormData({}));
      expect(result).toEqual({ error: "Not authenticated" });
    });

    it("returns schema error for invalid input", async () => {
      mockAuth.mockResolvedValue(fakeSession);
      const result = await changePassword(
        makeFormData({ currentPassword: "oldpass", newPassword: "short" }),
      );
      expect(result).toEqual({
        error: "New password must be at least 8 characters",
      });
      expect(mockFacade.changePassword).not.toHaveBeenCalled();
    });

    it("delegates valid payload to facade", async () => {
      mockAuth.mockResolvedValue(fakeSession);
      mockFacade.changePassword.mockResolvedValue({});

      const result = await changePassword(
        makeFormData({
          currentPassword: "oldpass123",
          newPassword: "newpass123",
        }),
      );

      expect(mockFacade.changePassword).toHaveBeenCalledWith(
        "user-1",
        "oldpass123",
        "newpass123",
      );
      expect(result).toEqual({});
    });
  });

  describe("updateProfile", () => {
    it("returns error when not authenticated", async () => {
      mockAuth.mockResolvedValue(null);
      const result = await updateProfile(makeFormData({}));
      expect(result).toEqual({ error: "Not authenticated" });
    });

    it("returns facade error when update fails", async () => {
      mockAuth.mockResolvedValue(fakeSession);
      mockFacade.updateProfile.mockResolvedValue({
        error: "That phone number is already in use",
      });

      const result = await updateProfile(
        makeFormData({ firstName: "John", lastName: "Doe", phone: "555-0000" }),
      );

      expect(result).toEqual({ error: "That phone number is already in use" });
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("revalidates account path on success", async () => {
      mockAuth.mockResolvedValue(fakeSession);
      mockFacade.updateProfile.mockResolvedValue({});

      await updateProfile(
        makeFormData({
          firstName: "John",
          lastName: "Doe",
          phone: "555-1234",
          addressLine1: "123 Main St",
          city: "Atlanta",
          state: "GA",
          postalCode: "30301",
          country: "US",
        }),
      );

      expect(mockFacade.updateProfile).toHaveBeenCalledWith(
        "user-1",
        "CUSTOMER",
        expect.objectContaining({ firstName: "John", lastName: "Doe" }),
      );
      expect(revalidatePath).toHaveBeenCalledWith("/account");
    });
  });

  describe("removeFavoriteAction", () => {
    it("returns auth error when not authenticated", async () => {
      mockAuth.mockResolvedValue(null);
      const result = await removeFavoriteAction(makeFormData({ movieId: "5" }));
      expect(result).toEqual({ error: "Not authenticated" });
      expect(mockFacade.removeFavorite).not.toHaveBeenCalled();
    });

    it("does nothing when movieId is missing", async () => {
      mockAuth.mockResolvedValue(fakeSession);
      await removeFavoriteAction(makeFormData({}));
      expect(mockFacade.removeFavorite).not.toHaveBeenCalled();
    });

    it("removes favorite and revalidates default path", async () => {
      mockAuth.mockResolvedValue(fakeSession);
      mockFacade.removeFavorite.mockResolvedValue(undefined);

      await removeFavoriteAction(makeFormData({ movieId: "42" }));

      expect(mockFacade.removeFavorite).toHaveBeenCalledWith("user-1", 42);
      expect(revalidatePath).toHaveBeenCalledWith("/account");
    });

    it("revalidates custom path when provided", async () => {
      mockAuth.mockResolvedValue(fakeSession);
      mockFacade.removeFavorite.mockResolvedValue(undefined);

      await removeFavoriteAction(
        makeFormData({ movieId: "7" }),
        "/account/favorites",
      );

      expect(mockFacade.removeFavorite).toHaveBeenCalledWith("user-1", 7);
      expect(revalidatePath).toHaveBeenCalledWith("/account/favorites");
    });
  });
});
