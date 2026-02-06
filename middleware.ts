export { auth as middleware } from "@/lib/auth";

// 强制使用 Node.js runtime，因为 NextAuth 和 bcryptjs 不兼容 Edge Runtime
export const runtime = 'nodejs';

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
