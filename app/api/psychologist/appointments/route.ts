import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendApiUrl } from "@/lib/api-url";
import { ACCESS_COOKIE } from "@/lib/auth-cookies";

export async function GET(request: Request) {
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;
  if (!access) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const url = `${backendApiUrl()}/psychologist/appointments${status ? `?status=${status}` : ""}`;

  const upstream = await fetch(url, {
    headers: { Authorization: `Bearer ${access}` },
    cache: "no-store",
  });
  const data = await upstream.json();
  console.log(data);
  return NextResponse.json(data, { status: upstream.status });
}
