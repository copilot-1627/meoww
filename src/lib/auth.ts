import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./db"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
    redirect: ({ url, baseUrl }) => {
      // Redirect to dashboard after successful login
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/dashboard`
      }
      return `${baseUrl}/dashboard`
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: "database",
  },
}