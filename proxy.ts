import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function getSessionToken(request: NextRequest): string | undefined {
  return (
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value
  );
}

function getUserRole(token: string): string | null {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  return (payload.role as string) || null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const sessionToken = getSessionToken(request);

  // --- /admin routes: require admin or agent role ---
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin") return NextResponse.next();
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    const role = getUserRole(sessionToken);
    if (role !== "admin" && role !== "agent") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // --- /crm routes: require agent role ---
  if (pathname.startsWith("/crm")) {
    if (pathname === "/crm") return NextResponse.next();
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/crm", request.url));
    }
    const role = getUserRole(sessionToken);
    if (role !== "agent" && role !== "admin") {
      return NextResponse.redirect(new URL("/crm", request.url));
    }
    return NextResponse.next();
  }

  // --- /portal routes: require client role ---
  if (pathname.startsWith("/portal")) {
    if (pathname === "/portal") return NextResponse.next();
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
    const role = getUserRole(sessionToken);
    if (role !== "client") {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/crm/:path*", "/portal/:path*"],
};
