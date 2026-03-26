"use server";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";
import sgMail from "@sendgrid/mail";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function signUp(formData: FormData) {
  const email = (formData.get("email") as string)?.trim();
  const userName = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Field presence validation
  if (!email || !userName || !password || !confirmPassword)
    return { error: "Please fill out all sections of the form" };

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return { error: "Please enter a valid email address" };

  // Username length validation
  if (userName.length < 3 || userName.length > 32)
    return { error: "Username must be between 3 and 32 characters" };

  // Password strength validation
  if (password.length < 8)
    return { error: "Password must be at least 8 characters" };

  if (password !== confirmPassword) return { error: "Passwords don't match" };

  const sql = neon(process.env.DATABASE_URL!);

  const checkUser = await sql`SELECT user_id FROM users WHERE email = ${email}`;
  if (checkUser.length > 0) return { error: "That email is already in use" };

  const checkUsername =
    await sql`SELECT user_id FROM users WHERE username = ${userName}`;
  if (checkUsername.length > 0)
    return { error: "That username is already taken." };

  const hashPass = await bcrypt.hash(password, 12);
  const verificationKey = await bcrypt.genSalt(32);

  await sql`
    WITH new_user AS (
      INSERT INTO users(username, email, password, user_type, verified, verification_key)
      VALUES (${userName}, ${email}, ${hashPass}, 'CUSTOMER', false, ${verificationKey})
      RETURNING user_id
    )
    INSERT INTO customers(customer_id, status)
    SELECT user_id, 'ACTIVE' FROM new_user
  `;

  try {
    await sgMail.send({
      to: email,
      from: "cinemabookingsystemxyz@gmail.com",
      templateId: "d-ccc0d92738fc40999081974c0dee0aaf",
      dynamicTemplateData: {
        verifyUrl: `http://localhost:3000/verificationPage?key=${encodeURIComponent(verificationKey)}`,
        username: userName,
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
    SELECT user_id, username, verified FROM users WHERE email = ${email.trim()}
  `;

  if (users.length === 0) {
    return { error: "No account found with that email address." };
  }

  const user = users[0];

  if (user.verified) {
    return { error: "This account is already verified. You can sign in." };
  }

  const verificationKey = await bcrypt.genSalt(32);

  await sql`
    UPDATE users SET verification_key = ${verificationKey} WHERE user_id = ${user.user_id}
  `;

  try {
    await sgMail.send({
      to: email.trim(),
      from: "cinemabookingsystemxyz@gmail.com",
      templateId: "d-ccc0d92738fc40999081974c0dee0aaf",
      dynamicTemplateData: {
        verifyUrl: `http://localhost:3000/verificationPage?key=${encodeURIComponent(verificationKey)}`,
        username: user.username,
      },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to send verification email";
    return { error: `Email error: ${message}` };
  }

  return { success: "Verification email sent. Please check your inbox." };
}
