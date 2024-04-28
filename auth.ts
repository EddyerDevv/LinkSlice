import type { Adapter } from "next-auth/adapters";
import type { User as UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type DefaultSession } from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import db from "#db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      role: UserRole["role"];
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole["role"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    session: ({ session, user }) => ({
      userId: session.user.id,
      expires: session.expires,
      user: {
        ...session.user,
        role: user.role,
      },
    }),
  },
  adapter: PrismaAdapter(db) as Adapter,
  secret: [process.env.AUTH_SECRET as string],
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  cookies: {
    sessionToken: {
      name: "linksnip.session-token",
    },
    callbackUrl: {
      name: "linksnip.callback-url",
    },
    csrfToken: {
      name: "linksnip.csrf-token",
    },
    nonce: {
      name: "linksnip.nonce",
    },
    pkceCodeVerifier: {
      name: "linksnip.pkc-code-verifier",
    },
    state: {
      name: "linksnip.state",
    },
    webauthnChallenge: {
      name: "linksnip.web-authn-challenge",
    },
  },
});
