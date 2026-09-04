import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Kept local — importing lib/auth pulls in Prisma/next-agnostic code.
const SESSION_COOKIE_NAME = "factenglish_session";

/**
 * Protected prefixes. DB-backed session validation happens in route layouts
 * (getSessionUser) so an expired cookie never causes redirect loops here —
 * this layer only keeps truly anonymous traffic off protected pages fast.
 */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/learn",
  "/listening",
  "/quiz",
  "/exercises",
  "/progress",
  "/bookmarks",
  "/notes",
  "/profile",
  "/settings",
  "/certificates",
  "/api/progress",
  "/api/quiz",
  "/api/listening",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionCookie = Boolean(
    request.cookies.get(SESSION_COOKIE_NAME)?.value
  );

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (isProtected && !hasSessionCookie) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  return response;
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/403",
    "/courses/:path*",
    "/levels/:path*",
    "/search/:path*",
    "/verify/:path*",
    "/dashboard/:path*",
    "/learn/:path*",
    "/listening/:path*",
    "/quiz/:path*",
    "/exercises/:path*",
    "/progress/:path*",
    "/bookmarks/:path*",
    "/notes/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/certificates/:path*",
    "/admin/:path*",
    "/api/:path*",
  ],
};
