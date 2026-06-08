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
  if (!access) return NextResponse.json({ match: null });
  const upstream = await fetch(`${backendApiUrl()}/user/match`, {
    headers: { Authorization: `Bearer ${access}` },
    cache: "no-store",
  });
  if (!upstream.ok) return NextResponse.json({ match: null });
  return NextResponse.json(await upstream.json());
}

export async function DELETE(request: Request) {
  const access = await getAccess();
  if (!access) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  let body: unknown = {};
  try { body = await request.json(); } catch { /* no body */ }
  const upstream = await fetch(`${backendApiUrl()}/user/match`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
    body: JSON.stringify(body),
  });
  if (upstream.status === 204) return new NextResponse(null, { status: 204 });
  return NextResponse.json(await upstream.json(), { status: upstream.status });
}
