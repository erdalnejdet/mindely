import { NextResponse } from "next/server";
import { backendApiUrl } from "@/lib/api-url";
import { attachAuthCookies } from "@/lib/auth-set-cookies";

type LoginBody = { email?: string; password?: string };

export async function POST(request: Request) {
  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }
  if (typeof body.email !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }

  const upstream = await fetch(`${backendApiUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: body.email, password: body.password }),
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
      typeof data === "object" && data && "error" in data ? data : { error: "LOGIN_FAILED" },
      { status: upstream.status },
    );
  }

  const parsed = data as {
    accessToken?: string;
    refreshToken?: string;
    user?: unknown;
  };
  if (typeof parsed.accessToken !== "string" || typeof parsed.refreshToken !== "string") {
    return NextResponse.json({ error: "BAD_GATEWAY" }, { status: 502 });
  }

  const res = NextResponse.json({ user: parsed.user ?? null });
  attachAuthCookies(res, parsed.accessToken, parsed.refreshToken);
  return res;
}
