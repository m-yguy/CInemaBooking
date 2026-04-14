import { sendPasswordChangedEmail } from "@/lib/mail";
import {
  getUserById,
  getUserByEmail,
  getUserPassword,
  getUserType as getUserTypeRepo,
  updateUserPassword,
  updateUserBasicInfo,
  upsertMailingAddress,
  getMailingAddress,
  deleteUser,
  verifyEmailToken,
  createCustomerUser,
  insertEmailVerificationToken,
  upsertEmailVerificationToken,
  upsertPasswordResetToken,
  getPasswordResetToken,
  deletePasswordResetToken,
  type UserProfile,
  type UserRecord,
  type MailingAddress,
} from "@/lib/repositories/userRepository";

export type { UserProfile, UserRecord, MailingAddress };

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
  const user = await getUserById(userId);
  await sendPasswordChangedEmail(user?.email ?? "", user?.first_name ?? "there");
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

export async function findUserByEmail(
  email: string,
): Promise<UserRecord | null> {
  return getUserByEmail(email);
}

export async function getUserType(userId: string): Promise<string | null> {
  return getUserTypeRepo(userId);
}

export async function createCustomer(data: {
  firstName: string;
  lastName: string;
  email: string;
  hashedPassword: string;
  receivesPromos: boolean;
}): Promise<string> {
  return createCustomerUser(data);
}

export async function insertVerificationToken(
  userId: string,
  token: string,
): Promise<void> {
  await insertEmailVerificationToken(userId, token);
}

export async function upsertVerificationToken(
  userId: string,
  token: string,
): Promise<void> {
  await upsertEmailVerificationToken(userId, token);
}

export async function upsertPasswordReset(
  userId: string,
  token: string,
): Promise<void> {
  await upsertPasswordResetToken(userId, token);
}

export async function getPasswordReset(
  token: string,
): Promise<{ user_id: string } | null> {
  return getPasswordResetToken(token) as Promise<{ user_id: string } | null>;
}

export async function deletePasswordReset(userId: string): Promise<void> {
  await deletePasswordResetToken(userId);
}
