import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendApiUrlOrNull } from "@/lib/api-url";
import { REFRESH_COOKIE } from "@/lib/auth-cookies";
import { clearAuthCookies } from "@/lib/auth-set-cookies";

export async function POST() {
  const jar = await cookies();
  const refresh = jar.get(REFRESH_COOKIE)?.value;
  if (refresh) {
    const base = backendApiUrlOrNull();
    if (base) {
      try {
        await fetch(`${base}/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: refresh }),
        });
      } catch {
        /* still clear cookies */
      }
    }
  }
  const res = NextResponse.json({ ok: true });
  clearAuthCookies(res);
  return res;
}
