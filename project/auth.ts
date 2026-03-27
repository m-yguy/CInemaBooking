import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { sql } from "@/lib/db";
import bcrypt from "bcrypt";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const users = await sql`
          SELECT user_id, first_name, last_name, email, password, user_type, verified
          FROM users
          WHERE email = ${credentials.email as string}
        `;

        if (users.length === 0) return null;

        const user = users[0];
        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password as string,
        );

        if (!passwordMatch) return null;
        if (!user.verified) return null;

        return {
          id: user.user_id as string,
          first_name: user.first_name as string,
          last_name: user.last_name as string,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email as string,
          role: user.user_type as string,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
        token.first_name = (user as { first_name: string }).first_name;
        token.last_name = (user as { last_name: string }).last_name;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.first_name = token.first_name as string;
      session.user.last_name = token.last_name as string;
      session.user.name = `${token.first_name ?? ""} ${token.last_name ?? ""}`.trim();
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});