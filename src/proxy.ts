import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected Routes requiring Admin authentication
  const isAdminRoute =
    pathname.startsWith("/audit/") || pathname.startsWith("/admin");

  // Read Better Auth session token cookie
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  // If attempting to access protected admin/audit routes without a session
  if (isAdminRoute && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in, redirect away from /login and /register
  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (isAuthPage && sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/audit/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
