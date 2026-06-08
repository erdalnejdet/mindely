import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth-cookies";
import { getAccessJwtSecretKey } from "@/lib/jwt";

function isProtectedPath(pathname: string): boolean {
  if (pathname.startsWith("/dashboard")) return true;
  if (pathname === "/onboarding/psychologist" || pathname.startsWith("/onboarding/psychologist/")) {
    return true;
  }
  return false;
}

export async function middleware(req: NextRequest) {
  if (!isProtectedPath(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  let secretKey: Uint8Array;
  try {
    secretKey = getAccessJwtSecretKey();
  } catch {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const access = req.cookies.get(ACCESS_COOKIE)?.value;
  if (access) {
    try {
      const { payload } = await jwtVerify(access, secretKey, {
        algorithms: ["HS256"],
      });
      const p = payload as Record<string, unknown>;
      const role = p.role as string | undefined;
      const email = typeof p.email === "string" ? p.email : "";
      const emailVerified = p.emailVerified !== false;

      if (role === "psychologist" && !emailVerified) {
        const u = new URL("/auth/verify-email", req.url);
        u.searchParams.set("email", email);
        return NextResponse.redirect(u);
      }

      if (req.nextUrl.pathname.startsWith("/onboarding/psychologist")) {
        if (role !== "psychologist") {
          const dest = role === "admin" ? "/dashboard" : "/";
          return NextResponse.redirect(new URL(dest, req.url));
        }
        return NextResponse.next();
      }

      if (role === "psychologist" || role === "admin") {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/", req.url));
    } catch {
      /* try refresh */
    }
  }

  if (req.cookies.get(REFRESH_COOKIE)?.value) {
    const url = new URL("/api/auth/reconcile", req.url);
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.redirect(
    new URL(`/auth/login?next=${encodeURIComponent(req.nextUrl.pathname)}`, req.url),
  );
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/psychologist", "/onboarding/psychologist/:path*"],
};
