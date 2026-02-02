import NextAuth from "next-auth";
import { authConfig } from "./authConfig";
import { prisma } from "@/lib/prisma";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.cargo = user.cargo;
        token.nome = user.nome;
        token.status = user.status;
        token.suspendedUntil = user.suspendedUntil;
      } else if (token.id) {
        // Fetch fresh data from DB on subsequent calls
        const freshUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            status: true,
            suspendedUntil: true,
            cargo: true,
            nome: true,
          },
        });

        if (freshUser) {
          token.status = freshUser.status;
          token.suspendedUntil = freshUser.suspendedUntil;
          token.cargo = freshUser.cargo;
          token.nome = freshUser.nome;
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.cargo = token.cargo as string;
      session.user.nome = token.nome as string;
      session.user.status = token.status as string;
      session.user.suspendedUntil = token.suspendedUntil
        ? new Date(token.suspendedUntil as string | Date)
        : undefined;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
