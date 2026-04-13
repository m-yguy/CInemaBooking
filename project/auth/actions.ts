"use server";
import crypto from "crypto";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
} from "@/lib/mail";
import { hashPassword } from "@/lib/security";
import {
  getUserByEmail,
  getUserById,
  createCustomerUser,
  insertEmailVerificationToken,
  upsertEmailVerificationToken,
  upsertPasswordResetToken,
  getPasswordResetToken,
  deletePasswordResetToken,
  updateUserPassword,
} from "@/lib/repositories/userRepository";

export async function signUp(formData: FormData) {
  const email = (formData.get("email") as string)?.trim();
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const receivesPromos = formData.get("receivesPromos") === "on";

  // Field presence validation
  if (!email || !firstName || !lastName || !password || !confirmPassword)
    return { error: "Please fill out all sections of the form" };

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return { error: "Please enter a valid email address" };

  // Password strength validation
  if (password.length < 8)
    return { error: "Password must be at least 8 characters" };

  if (password !== confirmPassword) return { error: "Passwords don't match" };

  const existingUser = await getUserByEmail(email);
  if (existingUser) return { error: "That email is already in use" };

  const hashedPassword = await hashPassword(password);
  const token = crypto.randomBytes(32).toString("hex");

  const userId = await createCustomerUser({
    firstName,
    lastName,
    email,
    hashedPassword,
    receivesPromos,
  });

  await insertEmailVerificationToken(userId, token);

  const verifyUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/verificationPage?key=${encodeURIComponent(token)}`;
  try {
    await sendVerificationEmail(email, firstName, lastName, verifyUrl);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to send verification email";
    return { error: `Email error: ${message}` };
  }

  return { success: "Verification email sent. Please check your inbox." };
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;

  const userRecord = await getUserByEmail(email);
  const redirectTo = userRecord?.user_type === "ADMIN" ? "/admin" : "/";

  try {
    await signIn("credentials", {
      email,
      password: formData.get("password"),
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        default:
          return { error: "Something went wrong. Please try again." };
      }
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}

export async function resendVerification(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email?.trim() || !emailRegex.test(email.trim())) {
    return { error: "Please enter a valid email address." };
  }

  const user = await getUserByEmail(email.trim());

  if (!user) {
    return { error: "No account found with that email address." };
  }

  if (user.verified) {
    return { error: "This account is already verified. You can sign in." };
  }

  const token = crypto.randomBytes(32).toString("hex");
  await upsertEmailVerificationToken(user.user_id as string, token);

  const verifyUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/verificationPage?key=${encodeURIComponent(token)}`;
  try {
    await sendVerificationEmail(
      email.trim(),
      user.first_name as string,
      user.last_name as string,
      verifyUrl,
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to send verification email";
    return { error: `Email error: ${message}` };
  }

  return { success: "Verification email sent. Please check your inbox." };
}

export async function checkEmailVerified(
  email: string,
): Promise<{ verified: boolean } | null> {
  if (!email?.trim()) return null;
  const user = await getUserByEmail(email.trim());
  if (!user) return null;
  return { verified: !!user.verified };
}

export async function requestPasswordReset(
  email: string,
): Promise<{ error?: string; success?: string }> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email?.trim() || !emailRegex.test(email.trim())) {
    return { error: "Please enter a valid email address." };
  }

  // Always return the same message to avoid user enumeration
  const genericSuccess = {
    success:
      "If that email is registered and verified, a reset link has been sent.",
  };

  const user = await getUserByEmail(email.trim());
  if (!user || !user.verified) return genericSuccess;

  const token = crypto.randomBytes(32).toString("hex");
  await upsertPasswordResetToken(user.user_id as string, token);

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const resetUrl = `${baseUrl}/resetPassword?token=${encodeURIComponent(token)}`;

  try {
    await sendPasswordResetEmail(
      email.trim(),
      user.first_name as string,
      user.last_name as string,
      resetUrl,
    );
  } catch {
    return { error: "Failed to send reset email. Please try again." };
  }

  return genericSuccess;
}

export async function resetPassword(
  token: string,
  newPassword: string,
  confirmPassword: string,
): Promise<{ error?: string; success?: string }> {
  if (!token) return { error: "Invalid or missing reset token." };
  if (!newPassword || newPassword.length < 8)
    return { error: "Password must be at least 8 characters." };
  if (newPassword !== confirmPassword)
    return { error: "Passwords don't match." };

  const tokenRow = await getPasswordResetToken(token);
  if (!tokenRow) {
    return {
      error: "Reset link is invalid or has expired. Please request a new one.",
    };
  }

  const userId = tokenRow.user_id as string;
  const hashedPassword = await hashPassword(newPassword);

  await updateUserPassword(userId, hashedPassword);
  await deletePasswordResetToken(userId);

  const user = await getUserById(userId);
  if (user) {
    await sendPasswordChangedEmail(
      user.email as string,
      user.first_name as string,
    );
  }

  return { success: "Password reset successfully. You can now sign in." };
}
