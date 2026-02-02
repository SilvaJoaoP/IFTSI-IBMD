import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    cargo: string;
    nome: string;
    status: string;
    suspendedUntil?: Date;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    cargo: string;
    nome: string;
    status: string;
    suspendedUntil?: Date;
  }
}
