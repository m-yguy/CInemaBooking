import { sql } from "@/lib/dbSingleton";

export interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  user_type: string;
}

export interface UserRecord {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  user_type: string;
  verified: boolean;
}

export interface MailingAddress {
  id: number;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export async function deleteUser(userId: string): Promise<void> {
  await sql`DELETE FROM customers WHERE customer_id = ${userId}`;
  await sql`DELETE FROM users WHERE user_id = ${userId}`;
}

export async function verifyEmailToken(token: string): Promise<boolean> {
  const result = await sql`
    WITH deleted AS (
      DELETE FROM email_verifications
      WHERE token = ${token} AND expires_at > NOW()
      RETURNING user_id
    ),
    activated_user AS (
      UPDATE users
      SET verified = true
      WHERE user_id = (SELECT user_id FROM deleted)
      RETURNING user_id
    )
    UPDATE customers
    SET status = 'ACTIVE'
    WHERE customer_id = (SELECT user_id FROM activated_user)
    RETURNING customer_id AS user_id
  `;
  return result.length > 0;
}

export async function getUserById(userId: string): Promise<UserProfile | null> {
  const rows = await sql`
    SELECT first_name, last_name, email, phone_number, user_type
    FROM users
    WHERE user_id = ${userId}
    LIMIT 1
  `;
  return (rows[0] as UserProfile) ?? null;
}

export async function getUserByEmail(
  email: string,
): Promise<UserRecord | null> {
  const rows = await sql`
    SELECT user_id, first_name, last_name, email, password, user_type, verified
    FROM users
    WHERE email = ${email}
  `;
  return (rows[0] as UserRecord) ?? null;
}

export async function createCustomerUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  hashedPassword: string;
  receivesPromos: boolean;
}): Promise<string> {
  const rows = await sql`
    WITH new_user AS (
      INSERT INTO users(first_name, last_name, email, password, user_type, verified, receives_promos)
      VALUES (${data.firstName}, ${data.lastName}, ${data.email}, ${data.hashedPassword}, 'CUSTOMER', false, ${data.receivesPromos})
      RETURNING user_id
    )
    INSERT INTO customers(customer_id, status)
    SELECT user_id, 'INACTIVE' FROM new_user
    RETURNING customer_id
  `;
  return rows[0].customer_id as string;
}

export async function insertEmailVerificationToken(
  userId: string,
  token: string,
) {
  await sql`
    INSERT INTO email_verifications(user_id, token, expires_at)
    VALUES (${userId}, ${token}, NOW() + INTERVAL '24 hours')
  `;
}

export async function upsertEmailVerificationToken(
  userId: string,
  token: string,
) {
  await sql`
    INSERT INTO email_verifications(user_id, token, expires_at)
    VALUES (${userId}, ${token}, NOW() + INTERVAL '24 hours')
    ON CONFLICT (user_id)
    DO UPDATE SET token = ${token}, expires_at = NOW() + INTERVAL '24 hours'
  `;
}

export async function upsertPasswordResetToken(userId: string, token: string) {
  await sql`
    INSERT INTO password_reset_tokens(user_id, token, expires_at)
    VALUES (${userId}, ${token}, NOW() + INTERVAL '1 hour')
    ON CONFLICT (user_id)
    DO UPDATE SET token = ${token}, expires_at = NOW() + INTERVAL '1 hour'
  `;
}

export async function getPasswordResetToken(token: string) {
  const rows = await sql`
    SELECT user_id FROM password_reset_tokens
    WHERE token = ${token} AND expires_at > NOW()
  `;
  return rows[0] ?? null;
}

export async function deletePasswordResetToken(userId: string) {
  await sql`DELETE FROM password_reset_tokens WHERE user_id = ${userId}`;
}

export async function getUserPassword(userId: string): Promise<string | null> {
  const rows =
    await sql`SELECT password FROM users WHERE user_id = ${userId} LIMIT 1`;
  return (rows[0]?.password as string) ?? null;
}

export async function updateUserPassword(
  userId: string,
  hashedPassword: string,
) {
  await sql`UPDATE users SET password = ${hashedPassword} WHERE user_id = ${userId}`;
}

export async function updateUserBasicInfo(
  userId: string,
  firstName: string,
  lastName: string,
  phone: string,
) {
  await sql`
    UPDATE users
    SET first_name = ${firstName},
        last_name  = ${lastName},
        phone_number = ${phone}
    WHERE user_id = ${userId}
  `;
}

export async function getUserType(userId: string): Promise<string | null> {
  const rows =
    await sql`SELECT user_type FROM users WHERE user_id = ${userId} LIMIT 1`;
  return (rows[0]?.user_type as string) ?? null;
}

export async function getMailingAddress(
  userId: string,
): Promise<MailingAddress | null> {
  const rows = await sql`
    SELECT id, address_line_1, address_line_2, city, state, postal_code, country
    FROM public.mailing_address
    WHERE customer_id = ${userId}
    LIMIT 1
  `;
  return (rows[0] as MailingAddress) ?? null;
}

export async function upsertMailingAddress(
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
  const updated = await sql`
    UPDATE public.mailing_address
    SET address_line_1 = ${data.addressLine1},
        address_line_2 = ${data.addressLine2},
        city           = ${data.city},
        state          = ${data.state},
        postal_code    = ${data.postalCode},
        country        = ${data.country},
        updated_at     = now()
    WHERE customer_id = ${userId}
    RETURNING id
  `;
  if (updated.length === 0) {
    await sql`
      INSERT INTO public.mailing_address
        (customer_id, address_line_1, address_line_2, city, state, postal_code, country)
      VALUES (${userId}, ${data.addressLine1}, ${data.addressLine2}, ${data.city}, ${data.state}, ${data.postalCode}, ${data.country})
    `;
  }
}
