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
  const upstream = await fetch(`${backendApiUrl()}/psychologist/subscription`, {
    headers: { Authorization: `Bearer ${access}` },
    cache: "no-store",
  });
  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}

export async function POST(request: Request) {
  const access = await getAccess();
  if (!access) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const body = await request.json();
  const upstream = await fetch(`${backendApiUrl()}/psychologist/subscription`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
    body: JSON.stringify(body),
  });
  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}

export async function DELETE() {
  const access = await getAccess();
  if (!access) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const upstream = await fetch(`${backendApiUrl()}/psychologist/subscription`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${access}` },
  });
  if (upstream.status === 204) return new NextResponse(null, { status: 204 });
  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
