// auth/actions.ts depends on "use server" which is a Next.js runtime directive.
// Jest runs in Node, so we mock the modules that have Next.js / DB dependencies.

jest.mock("@/auth", () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
}));
jest.mock("@/lib/mail");
jest.mock("@/lib/security");
jest.mock("@/lib/repositories/userRepository");

import {
  signUp,
  resendVerification,
  requestPasswordReset,
  resetPassword,
} from "@/auth/actions";
import * as userRepo from "@/lib/repositories/userRepository";
import * as mail from "@/lib/mail";
import * as security from "@/lib/securityFacade";

const mockGetUserByEmail = userRepo.getUserByEmail as jest.Mock;
const mockGetUserById = userRepo.getUserById as jest.Mock;
const mockCreateCustomerUser = userRepo.createCustomerUser as jest.Mock;
const mockInsertEmailVerificationToken =
  userRepo.insertEmailVerificationToken as jest.Mock;
const mockUpsertEmailVerificationToken =
  userRepo.upsertEmailVerificationToken as jest.Mock;
const mockUpsertPasswordResetToken =
  userRepo.upsertPasswordResetToken as jest.Mock;
const mockGetPasswordResetToken = userRepo.getPasswordResetToken as jest.Mock;
const mockDeletePasswordResetToken =
  userRepo.deletePasswordResetToken as jest.Mock;
const mockUpdateUserPassword = userRepo.updateUserPassword as jest.Mock;
const mockHashPassword = security.hashPassword as jest.Mock;
const mockSendVerificationEmail = mail.sendVerificationEmail as jest.Mock;
const mockSendPasswordChangedEmail = mail.sendPasswordChangedEmail as jest.Mock;

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  return fd;
}

// ---------------------------------------------------------------------------
// signUp
// ---------------------------------------------------------------------------
describe("signUp", () => {
  it("returns error when required fields are missing", async () => {
    const result = await signUp(makeFormData({ email: "a@b.com" }));
    expect(result).toEqual({
      error: "First name is required",
    });
  });

  it("returns error for invalid email format", async () => {
    const result = await signUp(
      makeFormData({
        email: "not-an-email",
        firstName: "A",
        lastName: "B",
        password: "password123",
        confirmPassword: "password123",
      }),
    );
    expect(result).toEqual({ error: "Invalid email address" });
  });

  it("returns error when password is too short", async () => {
    const result = await signUp(
      makeFormData({
        email: "a@b.com",
        firstName: "A",
        lastName: "B",
        password: "short",
        confirmPassword: "short",
      }),
    );
    expect(result).toEqual({ error: "Password must be at least 8 characters" });
  });

  it("returns error when passwords don't match", async () => {
    const result = await signUp(
      makeFormData({
        email: "a@b.com",
        firstName: "A",
        lastName: "B",
        password: "password123",
        confirmPassword: "different123",
      }),
    );
    expect(result).toEqual({ error: "Passwords don't match" });
  });

  it("returns error when email is already in use", async () => {
    mockGetUserByEmail.mockResolvedValue({ user_id: "1", email: "a@b.com" });
    const result = await signUp(
      makeFormData({
        email: "a@b.com",
        firstName: "A",
        lastName: "B",
        password: "password123",
        confirmPassword: "password123",
      }),
    );
    expect(result).toEqual({ error: "That email is already in use" });
  });

  it("creates user and sends verification email on success", async () => {
    mockGetUserByEmail.mockResolvedValue(null);
    mockHashPassword.mockResolvedValue("hashed");
    mockCreateCustomerUser.mockResolvedValue("new-user-id");
    mockInsertEmailVerificationToken.mockResolvedValue(undefined);
    mockSendVerificationEmail.mockResolvedValue(undefined);

    const result = await signUp(
      makeFormData({
        email: "new@example.com",
        firstName: "John",
        lastName: "Doe",
        password: "password123",
        confirmPassword: "password123",
      }),
    );

    expect(mockCreateCustomerUser).toHaveBeenCalledWith(
      expect.objectContaining({ email: "new@example.com", firstName: "John" }),
    );
    expect(mockInsertEmailVerificationToken).toHaveBeenCalledWith(
      "new-user-id",
      expect.any(String),
    );
    expect(mockSendVerificationEmail).toHaveBeenCalled();
    expect(result).toEqual({ success: expect.any(String) });
  });

  it("returns email error if sending verification email fails", async () => {
    mockGetUserByEmail.mockResolvedValue(null);
    mockHashPassword.mockResolvedValue("hashed");
    mockCreateCustomerUser.mockResolvedValue("new-user-id");
    mockInsertEmailVerificationToken.mockResolvedValue(undefined);
    mockSendVerificationEmail.mockRejectedValue(new Error("SMTP down"));

    const result = await signUp(
      makeFormData({
        email: "new@example.com",
        firstName: "John",
        lastName: "Doe",
        password: "password123",
        confirmPassword: "password123",
      }),
    );

    expect(result).toEqual({ error: expect.stringContaining("Email error") });
  });
});

// ---------------------------------------------------------------------------
// resendVerification
// ---------------------------------------------------------------------------
describe("resendVerification", () => {
  it("returns error for invalid email format", async () => {
    const result = await resendVerification("not-valid");
    expect(result).toEqual({ error: "Please enter a valid email address." });
  });

  it("returns error when no account exists", async () => {
    mockGetUserByEmail.mockResolvedValue(null);
    const result = await resendVerification("ghost@example.com");
    expect(result).toEqual({
      error: "No account found with that email address.",
    });
  });

  it("returns error when account is already verified", async () => {
    mockGetUserByEmail.mockResolvedValue({ user_id: "1", verified: true });
    const result = await resendVerification("verified@example.com");
    expect(result).toEqual({
      error: "This account is already verified. You can sign in.",
    });
  });

  it("sends verification email for unverified account", async () => {
    mockGetUserByEmail.mockResolvedValue({
      user_id: "1",
      verified: false,
      first_name: "Jane",
      last_name: "Doe",
    });
    mockUpsertEmailVerificationToken.mockResolvedValue(undefined);
    mockSendVerificationEmail.mockResolvedValue(undefined);

    const result = await resendVerification("jane@example.com");
    expect(mockSendVerificationEmail).toHaveBeenCalled();
    expect(result).toEqual({ success: expect.any(String) });
  });
});

// ---------------------------------------------------------------------------
// requestPasswordReset
// ---------------------------------------------------------------------------
describe("requestPasswordReset", () => {
  it("returns error for invalid email", async () => {
    const result = await requestPasswordReset("bad-email");
    expect(result).toEqual({ error: "Please enter a valid email address." });
  });

  it("returns generic success when no user found (prevents enumeration)", async () => {
    mockGetUserByEmail.mockResolvedValue(null);
    const result = await requestPasswordReset("nobody@example.com");
    expect(result).toEqual({ success: expect.any(String) });
    expect(mockSendVerificationEmail).not.toHaveBeenCalled();
  });

  it("returns generic success when account is unverified (prevents enumeration)", async () => {
    mockGetUserByEmail.mockResolvedValue({ user_id: "1", verified: false });
    const result = await requestPasswordReset("unverified@example.com");
    expect(result).toEqual({ success: expect.any(String) });
  });

  it("sends reset email for verified account", async () => {
    mockGetUserByEmail.mockResolvedValue({
      user_id: "1",
      verified: true,
      first_name: "John",
      last_name: "Doe",
    });
    mockUpsertPasswordResetToken.mockResolvedValue(undefined);
    (mail.sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined);

    const result = await requestPasswordReset("john@example.com");
    expect(mail.sendPasswordResetEmail).toHaveBeenCalled();
    expect(result).toEqual({ success: expect.any(String) });
  });
});

// ---------------------------------------------------------------------------
// resetPassword
// ---------------------------------------------------------------------------
describe("resetPassword", () => {
  it("returns error for missing token", async () => {
    const result = await resetPassword("", "newpass123", "newpass123");
    expect(result).toEqual({ error: "Invalid or missing reset token." });
  });

  it("returns error when password is too short", async () => {
    const result = await resetPassword("tok", "short", "short");
    expect(result).toEqual({
      error: "Password must be at least 8 characters",
    });
  });

  it("returns error when passwords don't match", async () => {
    const result = await resetPassword("tok", "newpass123", "different123");
    expect(result).toEqual({ error: "Passwords don't match" });
  });

  it("returns error when token is expired or invalid", async () => {
    mockGetPasswordResetToken.mockResolvedValue(null);
    const result = await resetPassword(
      "expired-token",
      "newpass123",
      "newpass123",
    );
    expect(result).toEqual({
      error: expect.stringContaining("invalid or has expired"),
    });
  });

  it("updates password and sends email on valid token", async () => {
    mockGetPasswordResetToken.mockResolvedValue({ user_id: "1" });
    mockHashPassword.mockResolvedValue("new-hashed");
    mockUpdateUserPassword.mockResolvedValue(undefined);
    mockDeletePasswordResetToken.mockResolvedValue(undefined);
    mockGetUserById.mockResolvedValue({
      email: "john@example.com",
      first_name: "John",
    });
    mockSendPasswordChangedEmail.mockResolvedValue(undefined);

    const result = await resetPassword(
      "valid-token",
      "newpass123",
      "newpass123",
    );

    expect(mockUpdateUserPassword).toHaveBeenCalledWith("1", "new-hashed");
    expect(mockDeletePasswordResetToken).toHaveBeenCalledWith("1");
    expect(mockSendPasswordChangedEmail).toHaveBeenCalledWith(
      "john@example.com",
      "John",
    );
    expect(result).toEqual({ success: expect.any(String) });
  });
});
