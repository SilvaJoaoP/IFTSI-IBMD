import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { compare } from "bcrypt";
import { authEdgeConfig } from "./authEdgeConfig";

export const authConfig: NextAuthConfig = {
  ...authEdgeConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, senha } = credentials;
        if (
          !email ||
          !senha ||
          typeof email !== "string" ||
          typeof senha !== "string"
        ) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: email },
        });

        if (!user) {
          return null;
        }

        const senhasBatem = await compare(senha, user.senha);

        if (senhasBatem) {
          return {
            id: user.id,
            email: user.email,
            nome: user.nome,
            cargo: user.cargo,
          };
        }

        return null;
      },
    }),
  ],
};
