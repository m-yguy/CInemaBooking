import crypto from "crypto";
import {
  sendPasswordChangedEmail,
  sendPasswordResetEmail,
  sendProfileUpdatedEmail,
  sendVerificationEmail,
} from "@/lib/mail";
import { comparePassword, hashPassword } from "@/lib/securityFacade";
import {
  getResetPasswordUrl,
  getVerificationUrl,
} from "@/lib/services/accountLinkService";
import * as favoriteService from "@/lib/services/favoriteService";
import * as paymentService from "@/lib/services/paymentService";
import * as userService from "@/lib/services/userService";

export type SignUpInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  receivesPromos: boolean;
};

export type UpdateProfileInput = {
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

export class UserAccountFacade {
  async getLoginRedirectPath(email: string): Promise<string> {
    try {
      const userRecord = await userService.findUserByEmail(email);
      return userRecord?.user_type === "ADMIN" ? "/admin" : "/";
    } catch {
      return "/";
    }
  }

  async getEmailVerifiedStatus(
    email: string,
  ): Promise<{ verified: boolean } | null> {
    try {
      const normalizedEmail = email.trim();
      const user = await userService.findUserByEmail(normalizedEmail);
      if (!user) return null;
      return { verified: !!user.verified };
    } catch {
      return null;
    }
  }

  async signUp(
    input: SignUpInput,
  ): Promise<{ error?: string; success?: string }> {
    try {
      const existingUser = await userService.findUserByEmail(input.email);
      if (existingUser) return { error: "That email is already in use" };

      const hashedPassword = await hashPassword(input.password);
      const token = crypto.randomBytes(32).toString("hex");

      const userId = await userService.createCustomer({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        hashedPassword,
        receivesPromos: input.receivesPromos,
      });

      await userService.insertVerificationToken(userId, token);

      const verifyUrl = getVerificationUrl(token);
      await sendVerificationEmail(
        input.email,
        input.firstName,
        input.lastName,
        verifyUrl,
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to send verification email";
      return { error: `Email error: ${message}` };
    }

    return { success: "Verification email sent. Please check your inbox." };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ error?: string; success?: string }> {
    try {
      const tokenRow = await userService.getPasswordReset(token);
      if (!tokenRow) {
        return {
          error:
            "Reset link is invalid or has expired. Please request a new one.",
        };
      }

      const userId = tokenRow.user_id as string;
      const hashedPassword = await hashPassword(newPassword);

      await userService.updatePassword(userId, hashedPassword);
      const user = await userService.getUserProfile(userId);
      await sendPasswordChangedEmail(
        user?.email ?? "",
        user?.first_name ?? "there",
      );
      await userService.deletePasswordReset(userId);

      return { success: "Password reset successfully. You can now sign in." };
    } catch {
      return { error: "Failed to reset password. Please try again." };
    }
  }

  async resendVerification(
    email: string,
  ): Promise<{ error?: string; success?: string }> {
    try {
      const normalizedEmail = email.trim();
      const user = await userService.findUserByEmail(normalizedEmail);

      if (!user) {
        return { error: "No account found with that email address." };
      }

      if (user.verified) {
        return { error: "This account is already verified. You can sign in." };
      }

      const token = crypto.randomBytes(32).toString("hex");
      await userService.upsertVerificationToken(user.user_id as string, token);

      const verifyUrl = getVerificationUrl(token);
      await sendVerificationEmail(
        normalizedEmail,
        user.first_name as string,
        user.last_name as string,
        verifyUrl,
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to send verification email";
      return { error: `Email error: ${message}` };
    }

    return { success: "Verification email sent. Please check your inbox." };
  }

  async requestPasswordReset(
    email: string,
  ): Promise<{ error?: string; success?: string }> {
    // Always return the same message to avoid user enumeration
    const genericSuccess = {
      success:
        "If that email is registered and verified, a reset link has been sent.",
    };

    try {
      const normalizedEmail = email.trim();
      const user = await userService.findUserByEmail(normalizedEmail);
      if (!user || !user.verified) return genericSuccess;

      const token = crypto.randomBytes(32).toString("hex");
      await userService.upsertPasswordReset(user.user_id as string, token);

      const resetUrl = getResetPasswordUrl(token);
      await sendPasswordResetEmail(
        normalizedEmail,
        user.first_name as string,
        user.last_name as string,
        resetUrl,
      );
    } catch {
      return { error: "Failed to send reset email. Please try again." };
    }

    return genericSuccess;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ error?: string }> {
    try {
      const storedPassword = await userService.getPasswordHash(userId);
      if (!storedPassword) return { error: "No password set on this account" };

      const isValid = await comparePassword(currentPassword, storedPassword);
      if (!isValid) return { error: "Password is incorrect" };

      const hashed = await hashPassword(newPassword);
      await userService.updatePassword(userId, hashed);
      const user = await userService.getUserProfile(userId);
      await sendPasswordChangedEmail(
        user?.email ?? "",
        user?.first_name ?? "there",
      );

      return {};
    } catch {
      return { error: "Failed to change password. Please try again." };
    }
  }

  async updateProfile(
    userId: string,
    role: string,
    input: UpdateProfileInput,
  ): Promise<{ error?: string }> {
    try {
      await userService.updateBasicInfo(
        userId,
        input.firstName,
        input.lastName,
        input.phone,
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("phone_number")) {
        return { error: "That phone number is already in use" };
      }
      return { error: "Failed to update profile. Please try again." };
    }

    try {
      const isCustomer = role === "CUSTOMER";
      if (!isCustomer) return {};

      const addressLine1 = input.addressLine1?.trim() ?? "";
      const city = input.city?.trim() ?? "";
      if (!addressLine1 && !city) return {};

      await userService.updateAddress(userId, {
        addressLine1,
        addressLine2: input.addressLine2?.trim() || null,
        city,
        state: input.state?.trim() ?? "",
        postalCode: input.postalCode?.trim() ?? "",
        country: input.country?.trim().toUpperCase() || "US",
      });

      return {};
    } catch {
      return { error: "Failed to update profile. Please try again." };
    }
  }

  async notifyProfileChange(userId: string, changes: string[]): Promise<void> {
    const user = await userService.getUserProfile(userId);
    await sendProfileUpdatedEmail(
      user?.email ?? "",
      user?.first_name ?? "there",
      changes,
    );
  }

  async removeFavorite(userId: string, movieId: number): Promise<void> {
    await favoriteService.removeFavoriteMovie(userId, movieId);
  }

  async deleteAccount(userId: string): Promise<void> {
    await userService.deleteUserAccount(userId);
  }

  async getAccountPageData(userId: string) {
    const user = await userService.getUserProfile(userId);
    const isCustomer = user?.user_type === "CUSTOMER";
    const [addressRow, savedCards, favoriteMovies] = await Promise.all([
      isCustomer
        ? userService.getUserMailingAddress(userId)
        : Promise.resolve(null),
      isCustomer ? paymentService.getCards(userId) : Promise.resolve([]),
      isCustomer
        ? favoriteService.getFavoriteMovieList(userId)
        : Promise.resolve([]),
    ]);
    return { user, isCustomer, addressRow, savedCards, favoriteMovies };
  }
}

export const userAccountFacade = new UserAccountFacade();
