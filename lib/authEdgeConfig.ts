import type { NextAuthConfig } from "next-auth";

export const authEdgeConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.cargo = user.cargo;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.cargo = token.cargo as string;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};
