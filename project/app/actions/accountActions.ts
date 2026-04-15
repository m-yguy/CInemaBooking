"use server";

import { revalidatePath } from "next/cache";
import { sendProfileUpdatedEmail } from "@/lib/mail";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import * as userService from "@/lib/services/userService";
import * as favoriteService from "@/lib/services/favoriteService";
import * as paymentService from "@/lib/services/paymentService";
import { withAuth } from "@/lib/middleware/withAuthDecorator";
import { changePasswordSchema } from "@/lib/schemas/userSchema";
import { userAccountFacade } from "@/lib/facades/userAccountFacade";

export const updateProfile = withAuth(async (session, formData: FormData) => {
  const result = await userAccountFacade.updateProfile(
    session.id,
    session.role,
    {
      firstName: (formData.get("firstName") as string)?.trim() ?? "",
      lastName: (formData.get("lastName") as string)?.trim() ?? "",
      phone: (formData.get("phone") as string)?.trim() ?? "",
      addressLine1: (formData.get("addressLine1") as string)?.trim() ?? "",
      addressLine2: (formData.get("addressLine2") as string)?.trim() ?? "",
      city: (formData.get("city") as string)?.trim() ?? "",
      state: (formData.get("state") as string)?.trim() ?? "",
      postalCode: (formData.get("postalCode") as string)?.trim() ?? "",
      country: (formData.get("country") as string)?.trim() ?? "",
    },
  );
  if (result.error) return result;

  revalidatePath("/account");
});

export const changePassword = withAuth(async (session, formData: FormData) => {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  const parsed = changePasswordSchema.safeParse({
    currentPassword,
    newPassword,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  return userAccountFacade.changePassword(
    session.id,
    currentPassword,
    newPassword,
  );
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
