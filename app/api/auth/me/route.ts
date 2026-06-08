import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendApiUrl } from "@/lib/api-url";
import { ACCESS_COOKIE } from "@/lib/auth-cookies";

export async function GET() {
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;
  if (!access) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const upstream = await fetch(`${backendApiUrl()}/auth/me`, {
    headers: { Authorization: `Bearer ${access}` },
    cache: "no-store",
  });

  const raw = await upstream.text();
  let data: unknown;
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    return NextResponse.json({ error: "BAD_GATEWAY" }, { status: 502 });
  }

  if (!upstream.ok) {
    return NextResponse.json(
      typeof data === "object" && data && "error" in data ? data : { error: "ME_FAILED" },
      { status: upstream.status },
    );
  }

  return NextResponse.json(data);
}
