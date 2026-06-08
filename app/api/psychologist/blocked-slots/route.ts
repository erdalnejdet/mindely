import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendApiUrl } from "@/lib/api-url";
import { ACCESS_COOKIE } from "@/lib/auth-cookies";

async function getAccess() {
  const jar = await cookies();
  return jar.get(ACCESS_COOKIE)?.value ?? null;
}

export async function GET() {
  const access = await getAccess();
  if (!access) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const upstream = await fetch(`${backendApiUrl()}/psychologist/blocked-slots`, {
    headers: { Authorization: `Bearer ${access}` },
    cache: "no-store",
  });
  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}

export async function POST(request: Request) {
  const access = await getAccess();
  if (!access) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const upstream = await fetch(`${backendApiUrl()}/psychologist/blocked-slots`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
    body: JSON.stringify(body),
  });
  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
