import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/mail";
import { comparePassword, hashPassword } from "@/lib/securityFacade";
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
  async signUp(
    input: SignUpInput,
  ): Promise<{ error?: string; success?: string }> {
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

    const verifyUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/verificationPage?key=${encodeURIComponent(token)}`;
    try {
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
    await userService.deletePasswordReset(userId);

    return { success: "Password reset successfully. You can now sign in." };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ error?: string }> {
    const storedPassword = await userService.getPasswordHash(userId);
    if (!storedPassword) return { error: "No password set on this account" };

    const isValid = await comparePassword(currentPassword, storedPassword);
    if (!isValid) return { error: "Password is incorrect" };

    const hashed = await hashPassword(newPassword);
    await userService.updatePassword(userId, hashed);

    return {};
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
      throw e;
    }

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
  }
}

export const userAccountFacade = new UserAccountFacade();
