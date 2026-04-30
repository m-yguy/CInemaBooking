"use server";

import { revalidatePath } from "next/cache";
import { withAuth } from "@/lib/middleware/withAuthDecorator";
import { changePasswordSchema } from "@/lib/schemas/userSchema";
import { userAccountFacade } from "@/lib/facades/userAccountFacade";
import { getOrderHistory } from "@/lib/repositories/bookingRepository";

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

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  return userAccountFacade.changePassword(
    session.id,
    currentPassword,
    newPassword,
  );
});

export const notifyProfileChange = withAuth(
  async (session, changes: string[]) => {
    await userAccountFacade.notifyProfileChange(session.id, changes);
  },
);

export const removeFavoriteAction = withAuth(
  async (session, formData: FormData, revalidateTo: string = "/account") => {
    const movieId = formData.get("movieId") as string;
    if (!movieId) return;

    await userAccountFacade.removeFavorite(session.id, parseInt(movieId, 10));
    revalidatePath(revalidateTo);
  },
);

export const deleteAccount = withAuth(async (session) => {
  await userAccountFacade.deleteAccount(session.id);
});

export async function getAccountPageData(userId: string) {
  const accountData = await userAccountFacade.getAccountPageData(userId);
  const orderHistory = await getOrderHistory(userId);

  return {
    ...accountData,
    orderHistory,
  };
}
