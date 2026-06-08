import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { REFRESH_COOKIE } from "@/lib/auth-cookies";
import { refreshTokensFromApi } from "@/lib/auth-refresh-server";
import { attachAuthCookies } from "@/lib/auth-set-cookies";
import { verifyAccessJwt } from "@/lib/jwt";

function safeInternalDestination(nextParam: string | null, req: NextRequest): string {
  const fallback = "/";
  if (!nextParam || !nextParam.startsWith("/") || nextParam.startsWith("//")) {
    return fallback;
  }
  try {
    const u = new URL(nextParam, req.url);
    if (u.origin !== req.nextUrl.origin) return fallback;
    return `${u.pathname}${u.search}`;
  } catch {
    return fallback;
  }
}

export async function GET(req: NextRequest) {
  const destPath = safeInternalDestination(req.nextUrl.searchParams.get("next"), req);

  const jar = await cookies();
  const rt = jar.get(REFRESH_COOKIE)?.value;
  if (!rt) {
    return NextResponse.redirect(
      new URL(`/auth/login?next=${encodeURIComponent(destPath)}`, req.url),
    );
  }

  const pair = await refreshTokensFromApi(rt);
  if (!pair) {
    return NextResponse.redirect(
      new URL(`/auth/login?next=${encodeURIComponent(destPath)}`, req.url),
    );
  }

  try {
    await verifyAccessJwt(pair.accessToken);
  } catch {
    return NextResponse.redirect(
      new URL(`/auth/login?next=${encodeURIComponent(destPath)}`, req.url),
    );
  }

  const res = NextResponse.redirect(new URL(destPath, req.url));
  attachAuthCookies(res, pair.accessToken, pair.refreshToken);
  return res;
}
