"use server";

import { revalidatePath } from "next/cache";
import { comparePassword, hashPassword } from "@/lib/securityFacade";
import { sendProfileUpdatedEmail } from "@/lib/mail";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import * as userService from "@/lib/services/userService";
import * as favoriteService from "@/lib/services/favoriteService";
import * as paymentService from "@/lib/services/paymentService";
import { withAuth } from "@/lib/middleware/withAuthDecorator";
import { changePasswordSchema } from "@/lib/schemas/userSchema";

export const updateProfile = withAuth(async (session, formData: FormData) => {
  const userId = session.id;
  const isCustomer = session.role === "CUSTOMER";

  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();

  try {
    await userService.updateBasicInfo(userId, firstName, lastName, phone);
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
      await userService.updateAddress(userId, {
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
});

export const changePassword = withAuth(async (session, formData: FormData) => {
  const userId = session.id;
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  const parsed = changePasswordSchema.safeParse({
    currentPassword,
    newPassword,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const storedPassword = await userService.getPasswordHash(userId);
  if (!storedPassword) return { error: "No password set on this account" };

  const isValid = await comparePassword(currentPassword, storedPassword);
  if (!isValid) return { error: "Password is incorrect" };

  const hashed = await hashPassword(newPassword);
  await userService.updatePassword(userId, hashed);

  return {};
});

export const notifyProfileChange = withAuth(
  async (session, changes: string[]) => {
    const user = await userService.getUserProfile(session.id);
    await sendProfileUpdatedEmail(
      user?.email ?? "",
      user?.first_name ?? "there",
      changes,
    );
  },
);

export const removeFavoriteAction = withAuth(
  async (session, formData: FormData, revalidateTo: string = "/account") => {
    const movieId = formData.get("movieId") as string;
    if (!movieId) return;

    await favoriteService.removeFavoriteMovie(session.id, parseInt(movieId));
    revalidatePath(revalidateTo);
  },
);

export const deleteAccount = withAuth(async (session) => {
  await userService.deleteUserAccount(session.id);
  await signOut({ redirectTo: "/" });
  redirect("/");
});

export async function getAccountPageData(userId: string) {
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
