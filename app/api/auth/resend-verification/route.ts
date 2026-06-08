import { NextResponse } from "next/server";
import { backendApiUrl } from "@/lib/api-url";

type Body = { email?: string };

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }
  if (typeof body.email !== "string") {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }

  const upstream = await fetch(`${backendApiUrl()}/auth/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: body.email }),
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
      typeof data === "object" && data && "error" in data ? data : { error: "RESEND_FAILED" },
      { status: upstream.status },
    );
  }

  return NextResponse.json(data);
}
