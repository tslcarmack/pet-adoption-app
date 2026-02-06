import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtected = ["/profile", "/favorites", "/applications", "/admin"].some(
        (path) => nextUrl.pathname.startsWith(path)
      );
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");

      if (isOnProtected && !isLoggedIn) {
        return false;
      }

      if (isOnAdmin && auth?.user?.role !== "ADMIN") {
        return false;
      }

      return true;
    },
  },
  providers: [], // Add providers here
};
