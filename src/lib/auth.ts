import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { UserStorage, isAdminEmail } from "./storage"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
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
              plan: 'FREE',
              subdomainLimit: 2,
              isAdmin: isAdminEmail(user.email)
            })
          } else {
            // Update existing user's info
            await UserStorage.update(existingUser.id, {
              name: user.name || existingUser.name,
              image: user.image || existingUser.image,
              isAdmin: isAdminEmail(user.email)
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
    async jwt({ token, user, account }) {
      if (user && account) {
        // Store user info in JWT token
        const dbUser = await UserStorage.findByEmail(user.email!)
        if (dbUser) {
          token.id = dbUser.id
          token.isAdmin = dbUser.isAdmin
          token.subdomainLimit = dbUser.subdomainLimit
          token.plan = dbUser.plan
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // Add user info from JWT token to session
        session.user.id = token.id as string
        session.user.isAdmin = token.isAdmin as boolean
        session.user.subdomainLimit = token.subdomainLimit as number
        session.user.plan = token.plan as string
      }
      return session
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
}