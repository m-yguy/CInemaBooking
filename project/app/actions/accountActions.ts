"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { comparePassword, hashPassword } from "@/lib/security";
import { sendPasswordChangedEmail, sendProfileUpdatedEmail } from "@/lib/mail";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import {
  getUserById,
  getUserPassword,
  updateUserBasicInfo,
  updateUserPassword,
  upsertMailingAddress,
  deleteUser,
  getMailingAddress,
} from "@/lib/repositories/userRepository";
import {
  removeFavorite,
  getFavoriteMovies,
} from "@/lib/repositories/favoriteRepository";
import { getPaymentCards } from "@/lib/repositories/paymentRepository";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session) return { error: "Not authenticated" };

  const userId = session.user.id;
  const isCustomer = session.user.role === "CUSTOMER";

  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();

  try {
    await updateUserBasicInfo(userId, firstName, lastName, phone);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("phone_number")) {
      return { error: "That phone number is already in use" };
    }
    throw e;
  }

  if (isCustomer) {
    const addressLine1 = (formData.get("addressLine1") as string)?.trim() ?? "";
    const addressLine2 =
      (formData.get("addressLine2") as string)?.trim() || null;
    const city = (formData.get("city") as string)?.trim() ?? "";
    const state = (formData.get("state") as string)?.trim() ?? "";
    const postalCode = (formData.get("postalCode") as string)?.trim() ?? "";
    const country =
      (formData.get("country") as string)?.trim().toUpperCase() || "US";
    if (addressLine1 || city) {
      await upsertMailingAddress(userId, {
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
      });
    }
  }

  revalidatePath("/account");
}

export async function changePassword(formData: FormData) {
  const session = await auth();
  if (!session) return { error: "Not authenticated" };

  const userId = session.user.id;
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!currentPassword) return { error: "Enter current password" };
  if (!newPassword) return { error: "New password cannot be empty" };
  if (newPassword.length < 8)
    return { error: "New password must be at least 8 characters" };

  const storedPassword = await getUserPassword(userId);
  if (!storedPassword) return { error: "No password set on this account" };

  const isValid = await comparePassword(currentPassword, storedPassword);
  if (!isValid) return { error: "Password is incorrect" };

  const hashed = await hashPassword(newPassword);
  await updateUserPassword(userId, hashed);

  const user = await getUserById(userId);
  await sendPasswordChangedEmail(
    user?.email ?? "",
    user?.first_name ?? "there",
  );

  return {};
}

export async function notifyProfileChange(changes: string[]) {
  const session = await auth();
  if (!session) return;

  const user = await getUserById(session.user.id);
  await sendProfileUpdatedEmail(
    user?.email ?? "",
    user?.first_name ?? "there",
    changes,
  );
}

export async function removeFavoriteAction(
  formData: FormData,
  revalidateTo = "/account",
) {
  const session = await auth();
  if (!session) return;

  const movieId = formData.get("movieId") as string;
  if (!movieId) return;

  await removeFavorite(session.user.id, parseInt(movieId));
  revalidatePath(revalidateTo);
}

export async function deleteAccount() {
  const session = await auth();
  if (!session) return;

  await deleteUser(session.user.id);
  await signOut({ redirectTo: "/" });
  redirect("/");
}

export async function getAccountPageData(userId: string) {
  const user = await getUserById(userId);
  const isCustomer = user?.user_type === "CUSTOMER";
  const [addressRow, savedCards, favoriteMovies] = await Promise.all([
    isCustomer ? getMailingAddress(userId) : Promise.resolve(null),
    isCustomer ? getPaymentCards(userId) : Promise.resolve([]),
    isCustomer ? getFavoriteMovies(userId) : Promise.resolve([]),
  ]);
  return { user, isCustomer, addressRow, savedCards, favoriteMovies };
}
