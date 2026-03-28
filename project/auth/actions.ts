"use server";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { sendPasswordResetEmail, sendPasswordChangedEmail } from "@/lib/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

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

  const sql = neon(process.env.DATABASE_URL!);

  const checkUser = await sql`SELECT user_id FROM users WHERE email = ${email}`;
  if (checkUser.length > 0) return { error: "That email is already in use" };

  const hashPass = await bcrypt.hash(password, 12);
  const token = crypto.randomBytes(32).toString("hex");

  const newUser = await sql`
    WITH new_user AS (
      INSERT INTO users( first_name, last_name, email, password, user_type, verified, receives_promos)
      VALUES (${firstName}, ${lastName}, ${email}, ${hashPass}, 'CUSTOMER', false, ${receivesPromos})
      RETURNING user_id
    )
    INSERT INTO customers(customer_id, status)
    SELECT user_id, 'INACTIVE' FROM new_user
    RETURNING customer_id
  `;

  const userId = newUser[0].customer_id;

  await sql`
    INSERT INTO email_verifications(user_id, token, expires_at)
    VALUES (${userId}, ${token}, NOW() + INTERVAL '24 hours')
  `;

  try {
    await sgMail.send({
      to: email,
      from: "cinemabookingsystemxyz@gmail.com",
      templateId: "d-ccc0d92738fc40999081974c0dee0aaf",
      dynamicTemplateData: {
        firstName: `${firstName}`,
        lastName: `${lastName}`,
        verifyUrl: `http://localhost:3000/verificationPage?key=${encodeURIComponent(token)}`,
      },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to send verification email";
    return { error: `Email error: ${message}` };
  }

  return { success: "Verification email sent. Please check your inbox." };
}

export async function login(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
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

  const sql = neon(process.env.DATABASE_URL!);

  const users = await sql`
    SELECT user_id, first_name, last_name, verified FROM users WHERE email = ${email.trim()}
  `;

  if (users.length === 0) {
    return { error: "No account found with that email address." };
  }

  const user = users[0];

  if (user.verified) {
    return { error: "This account is already verified. You can sign in." };
  }

  const token = crypto.randomBytes(32).toString("hex");

  await sql`
    INSERT INTO email_verifications(user_id, token, expires_at)
    VALUES (${user.user_id}, ${token}, NOW() + INTERVAL '24 hours')
    ON CONFLICT (user_id)
    DO UPDATE SET token = ${token}, expires_at = NOW() + INTERVAL '24 hours'
  `;

  try {
    await sgMail.send({
      to: email.trim(),
      from: "cinemabookingsystemxyz@gmail.com",
      templateId: "d-ccc0d92738fc40999081974c0dee0aaf",
      dynamicTemplateData: {
        verifyUrl: `http://localhost:3000/verificationPage?key=${encodeURIComponent(token)}`,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });
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
  const sql = neon(process.env.DATABASE_URL!);
  const users =
    await sql`SELECT verified FROM users WHERE email = ${email.trim()}`;
  if (users.length === 0) return null;
  return { verified: !!users[0].verified };
}

export async function requestPasswordReset(
  email: string,
): Promise<{ error?: string; success?: string }> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email?.trim() || !emailRegex.test(email.trim())) {
    return { error: "Please enter a valid email address." };
  }

  const sql = neon(process.env.DATABASE_URL!);
  const users = await sql`
    SELECT user_id, first_name, last_name, verified FROM users WHERE email = ${email.trim()}
  `;

  // Always return the same message to avoid user enumeration
  const genericSuccess = {
    success:
      "If that email is registered and verified, a reset link has been sent.",
  };

  if (users.length === 0 || !users[0].verified) return genericSuccess;

  const user = users[0];
  const token = crypto.randomBytes(32).toString("hex");

  await sql`
    INSERT INTO password_reset_tokens(user_id, token, expires_at)
    VALUES (${user.user_id}, ${token}, NOW() + INTERVAL '1 hour')
    ON CONFLICT (user_id)
    DO UPDATE SET token = ${token}, expires_at = NOW() + INTERVAL '1 hour'
  `;

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const resetUrl = `${baseUrl}/resetPassword?token=${encodeURIComponent(token)}`;

  try {
    await sendPasswordResetEmail(
      email.trim(),
      user.first_name,
      user.last_name,
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

  const sql = neon(process.env.DATABASE_URL!);
  const tokens = await sql`
    SELECT user_id FROM password_reset_tokens
    WHERE token = ${token} AND expires_at > NOW()
  `;

  if (tokens.length === 0) {
    return {
      error: "Reset link is invalid or has expired. Please request a new one.",
    };
  }

  const userId = tokens[0].user_id;
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await sql`UPDATE users SET password = ${hashedPassword} WHERE user_id = ${userId}`;
  await sql`DELETE FROM password_reset_tokens WHERE user_id = ${userId}`;

  const users =
    await sql`SELECT email, first_name FROM users WHERE user_id = ${userId}`;
  if (users.length > 0) {
    await sendPasswordChangedEmail(users[0].email, users[0].first_name);
  }

  return { success: "Password reset successfully. You can now sign in." };
}
