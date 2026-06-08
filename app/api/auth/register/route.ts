import { NextResponse } from "next/server";
import { backendApiUrl } from "@/lib/api-url";
import { attachAuthCookies } from "@/lib/auth-set-cookies";

type RegisterBody = {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
};

export async function POST(request: Request) {
  let body: RegisterBody;
  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }
  if (typeof body.email !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }

  const upstream = await fetch(`${backendApiUrl()}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: body.email,
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName,
    }),
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
      typeof data === "object" && data && "error" in data ? data : { error: "REGISTER_FAILED" },
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

  const res = NextResponse.json(
    {
      ok: true,
      message: "Kayıt tamamlandı. Giriş yapabilirsiniz.",
      user: parsed.user ?? null,
    },
    { status: 201 },
  );
  attachAuthCookies(res, parsed.accessToken, parsed.refreshToken);
  return res;
}
