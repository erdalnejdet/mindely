import { NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  cookieDefaults,
  expiresInToMaxAge,
} from "@/lib/auth-cookies";

export function attachAuthCookies(
  res: NextResponse,
  accessToken: string,
  refreshToken?: string,
): void {
  const prod = process.env.NODE_ENV === "production";
  const base = cookieDefaults(prod);
  const accessExp = process.env.JWT_ACCESS_EXPIRES ?? "15m";
  res.cookies.set(ACCESS_COOKIE, accessToken, {
    ...base,
    maxAge: expiresInToMaxAge(accessExp),
  });
  if (refreshToken) {
    const refreshExp = process.env.JWT_REFRESH_EXPIRES ?? "7d";
    res.cookies.set(REFRESH_COOKIE, refreshToken, {
      ...base,
      maxAge: expiresInToMaxAge(refreshExp),
    });
  }
}

export function clearAuthCookies(res: NextResponse): void {
  const prod = process.env.NODE_ENV === "production";
  const base = cookieDefaults(prod);
  res.cookies.set(ACCESS_COOKIE, "", { ...base, maxAge: 0 });
  res.cookies.set(REFRESH_COOKIE, "", { ...base, maxAge: 0 });
}
