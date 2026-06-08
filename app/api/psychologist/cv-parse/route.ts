import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendApiUrl } from "@/lib/api-url";
import { ACCESS_COOKIE } from "@/lib/auth-cookies";

export async function POST(request: Request) {
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;
  if (!access) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const formData = await request.formData();
  const upstream = await fetch(`${backendApiUrl()}/psychologist/cv-parse`, {
    method: "POST",
    headers: { Authorization: `Bearer ${access}` },
    body: formData,
  });
  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
