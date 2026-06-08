import { NextResponse } from "next/server";
import { REFRESH_COOKIE, cookieDefaults } from "@/lib/auth-cookies";
import { attachAuthCookies } from "@/lib/auth-set-cookies";
import { verifyAccessJwt, verifyRefreshJwt } from "@/lib/jwt";

type Body = { accessToken?: string; refreshToken?: string };

/**
 * One-time bridge: OAuth (or legacy) redirects may still carry tokens in the URL.
 * The browser POSTs them here once; we verify signatures, then store only in httpOnly cookies.
 */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }
  if (typeof body.accessToken !== "string") {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }

  try {
    await verifyAccessJwt(body.accessToken);
  } catch {
    return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 401 });
  }

  let refreshToken: string | undefined;
  if (typeof body.refreshToken === "string" && body.refreshToken.length > 0) {
    try {
      await verifyRefreshJwt(body.refreshToken);
      refreshToken = body.refreshToken;
    } catch {
      if (body.refreshToken.length >= 32) {
        refreshToken = body.refreshToken;
      }
    }
  }

  const res = NextResponse.json({ ok: true });
  attachAuthCookies(res, body.accessToken, refreshToken);
  if (!refreshToken) {
    const prod = process.env.NODE_ENV === "production";
    const base = cookieDefaults(prod);
    res.cookies.set(REFRESH_COOKIE, "", { ...base, maxAge: 0 });
  }
  return res;
}
