import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { REFRESH_COOKIE } from "@/lib/auth-cookies";
import { refreshTokensFromApi } from "@/lib/auth-refresh-server";
import { attachAuthCookies } from "@/lib/auth-set-cookies";
import { verifyAccessJwt } from "@/lib/jwt";

export async function POST() {
  const jar = await cookies();
  const refresh = jar.get(REFRESH_COOKIE)?.value;
  if (!refresh) {
    return NextResponse.json({ error: "NO_REFRESH" }, { status: 401 });
  }
  const pair = await refreshTokensFromApi(refresh);
  if (!pair) {
    const res = NextResponse.json({ error: "REFRESH_FAILED" }, { status: 401 });
    return res;
  }
  const res = NextResponse.json({ ok: true });
  attachAuthCookies(res, pair.accessToken, pair.refreshToken);
  return res;
}

export async function GET() {
  const jar = await cookies();
  const refresh = jar.get(REFRESH_COOKIE)?.value;
  if (!refresh) {
    return NextResponse.json({ error: "NO_REFRESH" }, { status: 401 });
  }
  const pair = await refreshTokensFromApi(refresh);
  if (!pair) {
    return NextResponse.json({ error: "REFRESH_FAILED" }, { status: 401 });
  }
  try {
    await verifyAccessJwt(pair.accessToken);
  } catch {
    return NextResponse.json({ error: "BAD_TOKEN" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  attachAuthCookies(res, pair.accessToken, pair.refreshToken);
  return res;
}
