"use server";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const userName = formData.get("username") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  //Check to see if form is working
  //console.log(`The email is ${email} the username is ${userName} the password is ${password} the confirmPassword is ${confirmPassword}`)

  const sql = neon(process.env.DATABASE_URL!);

  // validation process
  if (password !== confirmPassword) return { error: "Passwords don't match" };

  const checkUser = await sql`SELECT user_id FROM users WHERE email = ${email}`;
  if (checkUser.length > 0) return { error: "The Email is already in use" };

  // hash + enter into database
  const hashPass = await bcrypt.hash(password, 12);

  // Insert into users and customers in a single transaction
  await sql`
        WITH new_user AS (
            INSERT INTO users(username, email, password, user_type)
            VALUES (${userName}, ${email}, ${hashPass}, 'CUSTOMER')
            RETURNING user_id
        )
        INSERT INTO customers(customer_id, status)
        SELECT user_id, 'ACTIVE' FROM new_user
    `;

  return { success: true };
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
