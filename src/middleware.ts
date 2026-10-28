import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, SESSION_SECRET_TOKEN } from "@/lib/auth-constants";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isAuthed = sessionCookie === SESSION_SECRET_TOKEN;

  // Protect /admin/dashboard
  if (pathname.startsWith("/admin/dashboard")) {
    if (!isAuthed) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /api/admin/* (except /api/admin/auth)
  if (
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/auth")
  ) {
    if (!isAuthed) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  // Add OWASP Security Headers to all responses
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/api/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
