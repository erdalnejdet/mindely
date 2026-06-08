import { NextResponse } from "next/server";
import { backendApiUrl } from "@/lib/api-url";

type Body = {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  sessionDurationMinutes?: number;
};

const DEFAULT_SESSION_MIN = 45;

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
  const minutes =
    typeof body.sessionDurationMinutes === "number" ? body.sessionDurationMinutes : DEFAULT_SESSION_MIN;
  if (![30, 45, 60].includes(minutes)) {
    return NextResponse.json({ error: "INVALID_SESSION_DURATION" }, { status: 400 });
  }

  const upstreamBody: Record<string, unknown> = {
    email: body.email,
    firstName: body.firstName,
    lastName: body.lastName,
    phone: body.phone,
    sessionDurationMinutes: minutes,
  };
  if (typeof body.password === "string" && body.password.length > 0) {
    upstreamBody.password = body.password;
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${backendApiUrl()}/auth/register/psychologist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(upstreamBody),
    });
  } catch {
    return NextResponse.json(
      {
        error: "UPSTREAM_UNREACHABLE",
        message:
          "API’ye bağlanılamadı. Backend’in çalıştığından ve mindely/.env.local içinde BACKEND_API_URL değerinin doğru olduğundan emin olun.",
      },
      { status: 502 },
    );
  }

  const raw = await upstream.text();
  let data: unknown;
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    return NextResponse.json(
      {
        error: "BAD_GATEWAY",
        message:
          "API beklenmeyen bir yanıt döndürdü (JSON değil). Genelde ters vekil HTML/502 sayfasıdır: backend URL’ini ve sunucu loglarını kontrol edin.",
        upstreamStatus: upstream.status,
      },
      { status: 502 },
    );
  }

  if (!upstream.ok) {
    return NextResponse.json(
      typeof data === "object" && data && "error" in data ? data : { error: "REGISTER_FAILED" },
      { status: upstream.status },
    );
  }

  return NextResponse.json(data, { status: 201 });
}
