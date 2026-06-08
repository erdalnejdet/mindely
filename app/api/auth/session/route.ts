import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth-cookies";
import { refreshTokensFromApi } from "@/lib/auth-refresh-server";
import { attachAuthCookies } from "@/lib/auth-set-cookies";
import { verifyAccessJwt } from "@/lib/jwt";

export async function GET() {
  const jar = await cookies();
  let access = jar.get(ACCESS_COOKIE)?.value;
  const refresh = jar.get(REFRESH_COOKIE)?.value;

  async function claimsFromAccess(token: string | undefined) {
    if (!token) return null;
    try {
      return await verifyAccessJwt(token);
    } catch {
      return null;
    }
  }

  let claims = await claimsFromAccess(access);
  let rotated: { accessToken: string; refreshToken: string } | null = null;

  if (!claims && refresh) {
    rotated = await refreshTokensFromApi(refresh);
    if (rotated) {
      access = rotated.accessToken;
      claims = await claimsFromAccess(access);
    }
  }

  if (!claims) {
    return NextResponse.json({ user: null });
  }

  const res = NextResponse.json({
    user: {
      id: claims.sub,
      email: claims.email,
      name: claims.name,
      role: claims.role,
      emailVerified: claims.emailVerified,
    },
  });
  if (rotated) {
    attachAuthCookies(res, rotated.accessToken, rotated.refreshToken);
  }
  return res;
}
