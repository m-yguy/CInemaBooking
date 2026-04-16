"use server";
import { signIn, signOut } from "@/auth";
import { userAccountFacade } from "@/lib/facades/userAccountFacade";
import {
  signUpSchema,
  emailSchema,
  resetPasswordSchema,
} from "@/lib/schemas/userSchema";

export async function signUp(formData: FormData) {
  const parsed = signUpSchema.safeParse({
    firstName: (formData.get("firstName") as string)?.trim() ?? "",
    lastName: (formData.get("lastName") as string)?.trim() ?? "",
    email: (formData.get("email") as string)?.trim() ?? "",
    password: (formData.get("password") as string) ?? "",
    confirmPassword: (formData.get("confirmPassword") as string) ?? "",
    promotions: formData.get("receivesPromos") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const {
    firstName,
    lastName,
    email,
    password,
    promotions: receivesPromos,
  } = parsed.data;

  return userAccountFacade.signUp({
    firstName,
    lastName,
    email,
    password,
    receivesPromos: receivesPromos ?? false,
  });
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;

  const redirectTo = await userAccountFacade.getLoginRedirectPath(email);

  await signIn("credentials", {
    email,
    password: formData.get("password"),
    redirectTo,
  });
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}

export async function resendVerification(email: string) {
  if (!emailSchema.safeParse(email?.trim()).success) {
    return { error: "Please enter a valid email address." };
  }

  return userAccountFacade.resendVerification(email);
}

export async function checkEmailVerified(
  email: string,
): Promise<{ verified: boolean } | null> {
  if (!email?.trim()) return null;
  return userAccountFacade.getEmailVerifiedStatus(email);
}

export async function requestPasswordReset(
  email: string,
): Promise<{ error?: string; success?: string }> {
  if (!emailSchema.safeParse(email?.trim()).success) {
    return { error: "Please enter a valid email address." };
  }

  return userAccountFacade.requestPasswordReset(email);
}

export async function resetPassword(
  token: string,
  newPassword: string,
  confirmPassword: string,
): Promise<{ error?: string; success?: string }> {
  if (!token) return { error: "Invalid or missing reset token." };
  const parsed = resetPasswordSchema.safeParse({
    password: newPassword,
    confirmPassword,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  return userAccountFacade.resetPassword(token, newPassword);
}
