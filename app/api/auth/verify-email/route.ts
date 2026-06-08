import { NextResponse } from "next/server";
import { backendApiUrl } from "@/lib/api-url";

type Body = { email?: string; code?: string };

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }
  if (typeof body.email !== "string" || typeof body.code !== "string") {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }

  const upstream = await fetch(`${backendApiUrl()}/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: body.email, code: body.code }),
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
      typeof data === "object" && data && "error" in data ? data : { error: "VERIFY_FAILED" },
      { status: upstream.status },
    );
  }

  return NextResponse.json(data);
}
