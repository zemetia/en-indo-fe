import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const userData = request.cookies.get("userData");
  const { pathname } = request.nextUrl;

  // If trying to access dashboard without being logged in, redirect to login
  // Exclude pelayanan-saya from authentication requirement
  if (pathname.startsWith("/dashboard") && !userData) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If logged in, trying to access login page, redirect to dashboard
  if (pathname === "/login" && userData) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Matcher to specify which routes the middleware should run on.
  matcher: ["/dashboard/:path*", "/login"],
};
