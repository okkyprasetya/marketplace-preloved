import NextAuth, { type DefaultSession } from "next-auth";
import type { JWT } from "@auth/core/jwt";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { loginSchema } from "@/lib/validation/auth";
import { User, type UserRole } from "@/models/user";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const credentials = loginSchema.parse(rawCredentials);

        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email }).lean();
        if (!user || user.disabled) {
          return null;
        }

        const passwordIsValid = await compare(
          credentials.password,
          user.passwordHash,
        );

        if (!passwordIsValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    session({ session, token }) {
      const typedToken = token as JWT & { id?: string; role?: UserRole };

      if (session.user) {
        session.user.id = typedToken.id ?? "";
        session.user.role = typedToken.role ?? "buyer";
      }

      return session;
    },
  },
  events: {
    async signIn(message) {
      z.string().optional().parse(message.user.email);
    },
  },
});
