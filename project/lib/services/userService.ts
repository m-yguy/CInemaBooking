import {
  getUserById,
  getUserPassword,
  updateUserPassword,
  updateUserBasicInfo,
  upsertMailingAddress,
  getMailingAddress,
  deleteUser,
  verifyEmailToken,
  type UserProfile,
  type MailingAddress,
} from "@/lib/repositories/userRepository";

export type { UserProfile, MailingAddress };

export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  return getUserById(userId);
}

export async function getUserMailingAddress(
  userId: string,
): Promise<MailingAddress | null> {
  return getMailingAddress(userId);
}

export async function verifyEmail(token: string): Promise<boolean> {
  return verifyEmailToken(token);
}

export async function getPasswordHash(userId: string): Promise<string | null> {
  return getUserPassword(userId);
}

export async function updateBasicInfo(
  userId: string,
  firstName: string,
  lastName: string,
  phone: string,
): Promise<void> {
  await updateUserBasicInfo(userId, firstName, lastName, phone);
}

export async function updatePassword(
  userId: string,
  hashedPassword: string,
): Promise<void> {
  await updateUserPassword(userId, hashedPassword);
}

export async function updateAddress(
  userId: string,
  data: {
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  },
): Promise<void> {
  await upsertMailingAddress(userId, data);
}

export async function deleteUserAccount(userId: string): Promise<void> {
  await deleteUser(userId);
}
