jest.mock("@/auth", () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("@/lib/facades/userAccountFacade", () => ({
  userAccountFacade: {
    signUp: jest.fn(),
    getLoginRedirectPath: jest.fn(),
    resendVerification: jest.fn(),
    getEmailVerifiedStatus: jest.fn(),
    requestPasswordReset: jest.fn(),
    resetPassword: jest.fn(),
  },
}));

import { signIn, signOut } from "@/auth";
import {
  checkAccountExists,
  checkEmailVerified,
  login,
  logout,
  requestPasswordReset,
  resendVerification,
  resetPassword,
  signUp,
} from "@/auth/actions";
import { userAccountFacade } from "@/lib/facades/userAccountFacade";

const mockSignIn = signIn as jest.Mock;
const mockSignOut = signOut as jest.Mock;
const mockFacade = userAccountFacade as jest.Mocked<typeof userAccountFacade>;

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  return fd;
}

describe("auth actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signUp", () => {
    it("returns schema error when required fields are missing", async () => {
      const result = await signUp(makeFormData({ email: "a@b.com" }));
      expect(result).toEqual({ error: "First name is required" });
      expect(mockFacade.signUp).not.toHaveBeenCalled();
    });

    it("delegates valid payload to facade", async () => {
      mockFacade.signUp.mockResolvedValue({ success: "ok" });

      const result = await signUp(
        makeFormData({
          email: "new@example.com",
          firstName: "John",
          lastName: "Doe",
          password: "password123",
          confirmPassword: "password123",
          receivesPromos: "on",
        }),
      );

      expect(mockFacade.signUp).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        email: "new@example.com",
        password: "password123",
        receivesPromos: true,
      });
      expect(result).toEqual({ success: "ok" });
    });
  });

  describe("login", () => {
    it("uses facade redirect and signs in", async () => {
      mockFacade.getLoginRedirectPath.mockResolvedValue("/admin");
      mockSignIn.mockResolvedValue(undefined);

      await login(
        makeFormData({ email: "admin@example.com", password: "secret" }),
      );

      expect(mockFacade.getLoginRedirectPath).toHaveBeenCalledWith(
        "admin@example.com",
      );
      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        email: "admin@example.com",
        password: "secret",
        redirectTo: "/admin",
      });
    });

    it("throws sign-in errors", async () => {
      mockFacade.getLoginRedirectPath.mockResolvedValue("/");
      mockSignIn.mockRejectedValue(new Error("invalid credentials"));

      await expect(
        login(makeFormData({ email: "user@example.com", password: "bad" })),
      ).rejects.toThrow("invalid credentials");
    });

    it("throws redirect lookup failures", async () => {
      mockFacade.getLoginRedirectPath.mockRejectedValue(
        new Error("lookup failed"),
      );
      await expect(
        login(makeFormData({ email: "user@example.com", password: "bad" })),
      ).rejects.toThrow("lookup failed");
    });
  });

  describe("logout", () => {
    it("signs out to root", async () => {
      await logout();
      expect(mockSignOut).toHaveBeenCalledWith({ redirectTo: "/" });
    });
  });

  describe("resendVerification", () => {
    it("rejects invalid email before facade call", async () => {
      const result = await resendVerification("not-valid");
      expect(result).toEqual({ error: "Please enter a valid email address." });
      expect(mockFacade.resendVerification).not.toHaveBeenCalled();
    });

    it("delegates valid email to facade", async () => {
      mockFacade.resendVerification.mockResolvedValue({ success: "sent" });
      const result = await resendVerification("jane@example.com");
      expect(mockFacade.resendVerification).toHaveBeenCalledWith(
        "jane@example.com",
      );
      expect(result).toEqual({ success: "sent" });
    });
  });

  describe("checkEmailVerified", () => {
    it("returns null when email is empty", async () => {
      const result = await checkEmailVerified("   ");
      expect(result).toBeNull();
      expect(mockFacade.getEmailVerifiedStatus).not.toHaveBeenCalled();
    });

    it("delegates non-empty email to facade", async () => {
      mockFacade.getEmailVerifiedStatus.mockResolvedValue({ verified: true });
      const result = await checkEmailVerified("a@b.com");
      expect(mockFacade.getEmailVerifiedStatus).toHaveBeenCalledWith("a@b.com");
      expect(result).toEqual({ verified: true });
    });
  });

  describe("checkAccountExists", () => {
    it("returns false when email is empty", async () => {
      const result = await checkAccountExists("   ");
      expect(result).toBe(false);
      expect(mockFacade.getEmailVerifiedStatus).not.toHaveBeenCalled();
    });

    it("returns true when facade finds the account", async () => {
      mockFacade.getEmailVerifiedStatus.mockResolvedValue({ verified: true });
      const result = await checkAccountExists("a@b.com");
      expect(mockFacade.getEmailVerifiedStatus).toHaveBeenCalledWith("a@b.com");
      expect(result).toBe(true);
    });

    it("returns false when facade does not find the account", async () => {
      mockFacade.getEmailVerifiedStatus.mockResolvedValue(null);
      const result = await checkAccountExists("unknown@example.com");
      expect(mockFacade.getEmailVerifiedStatus).toHaveBeenCalledWith(
        "unknown@example.com",
      );
      expect(result).toBe(false);
    });
  });

  describe("requestPasswordReset", () => {
    it("rejects invalid email before facade call", async () => {
      const result = await requestPasswordReset("bad-email");
      expect(result).toEqual({ error: "Please enter a valid email address." });
      expect(mockFacade.requestPasswordReset).not.toHaveBeenCalled();
    });

    it("delegates valid email to facade", async () => {
      mockFacade.requestPasswordReset.mockResolvedValue({ success: "queued" });
      const result = await requestPasswordReset("john@example.com");
      expect(mockFacade.requestPasswordReset).toHaveBeenCalledWith(
        "john@example.com",
      );
      expect(result).toEqual({ success: "queued" });
    });
  });

  describe("resetPassword", () => {
    it("returns error for missing token", async () => {
      const result = await resetPassword("", "newpass123", "newpass123");
      expect(result).toEqual({ error: "Invalid or missing reset token." });
      expect(mockFacade.resetPassword).not.toHaveBeenCalled();
    });

    it("returns schema error for invalid password", async () => {
      const result = await resetPassword("tok", "short", "short");
      expect(result).toEqual({
        error: "Password must be at least 8 characters",
      });
      expect(mockFacade.resetPassword).not.toHaveBeenCalled();
    });

    it("delegates valid reset request to facade", async () => {
      mockFacade.resetPassword.mockResolvedValue({ success: "done" });
      const result = await resetPassword("tok", "newpass123", "newpass123");
      expect(mockFacade.resetPassword).toHaveBeenCalledWith(
        "tok",
        "newpass123",
      );
      expect(result).toEqual({ success: "done" });
    });
  });
});
