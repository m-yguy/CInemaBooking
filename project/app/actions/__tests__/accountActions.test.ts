jest.mock("@/auth", () => ({ auth: jest.fn(), signOut: jest.fn() }));
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));
jest.mock("next/navigation", () => ({ redirect: jest.fn() }));
jest.mock("@/lib/security");
jest.mock("@/lib/mail");
jest.mock("@/lib/repositories/userRepository");
jest.mock("@/lib/repositories/favoriteRepository");

import {
  changePassword,
  updateProfile,
  removeFavoriteAction,
} from "@/app/actions/accountActions";
import { auth } from "@/auth";
import * as security from "@/lib/security";
import * as mail from "@/lib/mail";
import * as userRepo from "@/lib/repositories/userRepository";
import * as favoriteRepo from "@/lib/repositories/favoriteRepository";
import { revalidatePath } from "next/cache";

const mockAuth = auth as jest.Mock;
const mockGetUserPassword = userRepo.getUserPassword as jest.Mock;
const mockGetUserById = userRepo.getUserById as jest.Mock;
const mockUpdateUserPassword = userRepo.updateUserPassword as jest.Mock;
const mockUpdateUserBasicInfo = userRepo.updateUserBasicInfo as jest.Mock;
const mockComparePassword = security.comparePassword as jest.Mock;
const mockHashPassword = security.hashPassword as jest.Mock;
const mockSendPasswordChangedEmail = mail.sendPasswordChangedEmail as jest.Mock;
const mockRemoveFavorite = favoriteRepo.removeFavorite as jest.Mock;

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  return fd;
}

const fakeSession = { user: { id: "user-1", role: "CUSTOMER" } };

// ---------------------------------------------------------------------------
// changePassword
// ---------------------------------------------------------------------------
describe("changePassword", () => {
  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const result = await changePassword(makeFormData({}));
    expect(result).toEqual({ error: "Not authenticated" });
  });

  it("returns error when current password field is empty", async () => {
    mockAuth.mockResolvedValue(fakeSession);
    const result = await changePassword(
      makeFormData({ currentPassword: "", newPassword: "newpass123" }),
    );
    expect(result).toEqual({ error: "Enter current password" });
  });

  it("returns error when new password is too short", async () => {
    mockAuth.mockResolvedValue(fakeSession);
    const result = await changePassword(
      makeFormData({ currentPassword: "oldpass", newPassword: "short" }),
    );
    expect(result).toEqual({
      error: "New password must be at least 8 characters",
    });
  });

  it("returns error when no password is set on the account", async () => {
    mockAuth.mockResolvedValue(fakeSession);
    mockGetUserPassword.mockResolvedValue(null);
    const result = await changePassword(
      makeFormData({
        currentPassword: "oldpass123",
        newPassword: "newpass123",
      }),
    );
    expect(result).toEqual({ error: "No password set on this account" });
  });

  it("returns error when current password is wrong", async () => {
    mockAuth.mockResolvedValue(fakeSession);
    mockGetUserPassword.mockResolvedValue("hashed-old");
    mockComparePassword.mockResolvedValue(false);
    const result = await changePassword(
      makeFormData({ currentPassword: "wrongpass", newPassword: "newpass123" }),
    );
    expect(result).toEqual({ error: "Password is incorrect" });
  });

  it("updates password and sends notification on success", async () => {
    mockAuth.mockResolvedValue(fakeSession);
    mockGetUserPassword.mockResolvedValue("hashed-old");
    mockComparePassword.mockResolvedValue(true);
    mockHashPassword.mockResolvedValue("hashed-new");
    mockUpdateUserPassword.mockResolvedValue(undefined);
    mockGetUserById.mockResolvedValue({
      email: "u@example.com",
      first_name: "John",
    });
    mockSendPasswordChangedEmail.mockResolvedValue(undefined);

    const result = await changePassword(
      makeFormData({
        currentPassword: "oldpass123",
        newPassword: "newpass123",
      }),
    );

    expect(mockUpdateUserPassword).toHaveBeenCalledWith("user-1", "hashed-new");
    expect(mockSendPasswordChangedEmail).toHaveBeenCalledWith(
      "u@example.com",
      "John",
    );
    expect(result).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// updateProfile
// ---------------------------------------------------------------------------
describe("updateProfile", () => {
  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const result = await updateProfile(makeFormData({}));
    expect(result).toEqual({ error: "Not authenticated" });
  });

  it("returns error when phone number is already in use", async () => {
    mockAuth.mockResolvedValue(fakeSession);
    mockUpdateUserBasicInfo.mockRejectedValue(
      new Error("phone_number unique violation"),
    );

    const result = await updateProfile(
      makeFormData({ firstName: "John", lastName: "Doe", phone: "555-0000" }),
    );
    expect(result).toEqual({ error: "That phone number is already in use" });
  });

  it("calls updateUserBasicInfo and revalidates on success", async () => {
    mockAuth.mockResolvedValue(fakeSession);
    mockUpdateUserBasicInfo.mockResolvedValue(undefined);
    (userRepo.upsertMailingAddress as jest.Mock).mockResolvedValue(undefined);

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

    expect(mockUpdateUserBasicInfo).toHaveBeenCalledWith(
      "user-1",
      "John",
      "Doe",
      "555-1234",
    );
    expect(revalidatePath).toHaveBeenCalledWith("/account");
  });
});

// ---------------------------------------------------------------------------
// removeFavoriteAction
// ---------------------------------------------------------------------------
describe("removeFavoriteAction", () => {
  it("does nothing when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    await removeFavoriteAction(makeFormData({ movieId: "5" }));
    expect(mockRemoveFavorite).not.toHaveBeenCalled();
  });

  it("does nothing when movieId is missing", async () => {
    mockAuth.mockResolvedValue(fakeSession);
    await removeFavoriteAction(makeFormData({}));
    expect(mockRemoveFavorite).not.toHaveBeenCalled();
  });

  it("removes favorite and revalidates /account by default", async () => {
    mockAuth.mockResolvedValue(fakeSession);
    mockRemoveFavorite.mockResolvedValue(undefined);

    await removeFavoriteAction(makeFormData({ movieId: "42" }));

    expect(mockRemoveFavorite).toHaveBeenCalledWith("user-1", 42);
    expect(revalidatePath).toHaveBeenCalledWith("/account");
  });

  it("revalidates the provided path when revalidateTo is given", async () => {
    mockAuth.mockResolvedValue(fakeSession);
    mockRemoveFavorite.mockResolvedValue(undefined);

    await removeFavoriteAction(
      makeFormData({ movieId: "7" }),
      "/account/favorites",
    );

    expect(mockRemoveFavorite).toHaveBeenCalledWith("user-1", 7);
    expect(revalidatePath).toHaveBeenCalledWith("/account/favorites");
  });
});
