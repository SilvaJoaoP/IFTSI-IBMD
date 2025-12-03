import NextAuth from "next-auth";
import { authEdgeConfig } from "./lib/authEdgeConfig";

const { auth } = NextAuth(authEdgeConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const estaLogado = !!req.auth;

  const ehPaginaDeAuth =
    nextUrl.pathname === "/" || nextUrl.pathname === "/cadastro";
  const ehPaginaDoApp = !ehPaginaDeAuth;

  if (ehPaginaDoApp && !estaLogado) {
    return Response.redirect(new URL("/", nextUrl));
  }

  if (ehPaginaDeAuth && estaLogado) {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }

  return;
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)",
  ],
};
