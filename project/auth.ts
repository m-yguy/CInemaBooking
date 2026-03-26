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
          SELECT user_id, username, email, password, user_type, verified
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
          name: user.username as string,
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
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});
