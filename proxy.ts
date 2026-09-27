import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { checkRateLimit } from "@/lib/utils/rate-limit";

const PUBLIC_PATHS = [
  "/",
  "/about",
  "/blog",
  "/services",
  "/case-studies",
  "/contact",
  "/hosting",
  "/careers",
  "/api/auth",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

function isLoginPage(pathname: string): boolean {
  return pathname === "/admin" || pathname === "/crm" || pathname === "/portal";
}

function isAuthPage(pathname: string): boolean {
  return pathname === "/portal" || pathname === "/portal/forgot-password" || pathname === "/portal/reset-password";
}

/**
 * Auth.js only sets the `__Secure-` cookie prefix on secure origins. Decoding
 * must therefore use the same flag, otherwise the token is read from the wrong
 * cookie name and every protected route redirects to the login page.
 */
function isSecureRequest(request: NextRequest): boolean {
  return (
    request.nextUrl.protocol === "https:" ||
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() === "https"
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limit login attempts
  if (pathname === "/api/auth/callback/credentials" && request.method === "POST") {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const { allowed, remaining } = checkRateLimit(`login:${ip}`);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    return response;
  }

  if (isPublicPath(pathname) || isLoginPage(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: isSecureRequest(request),
  });

  const role = token?.role as string | undefined;

  // Redirect authenticated clients away from auth pages
  if (isAuthPage(pathname) && token && role === "client") {
    return NextResponse.redirect(new URL("/portal/dashboard", request.url));
  }

  if (pathname.startsWith("/admin")) {
    if (!token || (role !== "admin" && role !== "agent")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  if (pathname.startsWith("/crm")) {
    if (!token || (role !== "agent" && role !== "admin")) {
      return NextResponse.redirect(new URL("/crm", request.url));
    }
  }

  if (pathname.startsWith("/portal")) {
    if (!token || role !== "client") {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/crm/:path*", "/portal/:path*", "/api/auth/callback/:path*"],
};
