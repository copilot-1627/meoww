import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { UserStorage, type User } from "./storage"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && user.email) {
        try {
          // Check if user already exists
          let existingUser = await UserStorage.findByEmail(user.email)
          
          if (!existingUser) {
            // Create new user
            existingUser = await UserStorage.create({
              email: user.email,
              name: user.name || '',
              image: user.image,
              plan: 'FREE'
            })
          } else {
            // Update existing user's info
            await UserStorage.update(existingUser.id, {
              name: user.name || existingUser.name,
              image: user.image || existingUser.image
            })
          }
          
          return true
        } catch (error) {
          console.error('Error in signIn callback:', error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user?.email) {
        try {
          const user = await UserStorage.findByEmail(session.user.email)
          if (user) {
            return {
              ...session,
              user: {
                ...session.user,
                id: user.id,
                plan: user.plan
              }
            }
          }
        } catch (error) {
          console.error('Error in session callback:', error)
        }
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token
      }
      return token
    },
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
    strategy: "jwt", // Changed from database to jwt strategy
  },
}