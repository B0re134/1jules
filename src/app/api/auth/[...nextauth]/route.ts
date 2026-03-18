import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import EmailProvider from "next-auth/providers/email"
import { PrismaClient } from "@prisma/client"
import { PrismaAdapter as NextAuthPrismaAdapter } from "@next-auth/prisma-adapter"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: NextAuthPrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER as string,
      from: process.env.EMAIL_FROM as string,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        // Since we added `role` to User model we can type cast this manually or extend types later
        (session.user as any).role = (user as any).role;
        (session.user as any).id = user.id;
      }
      return session;
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
