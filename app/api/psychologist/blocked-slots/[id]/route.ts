import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendApiUrl } from "@/lib/api-url";
import { ACCESS_COOKIE } from "@/lib/auth-cookies";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;
  if (!access) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const upstream = await fetch(`${backendApiUrl()}/psychologist/blocked-slots/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${access}` },
  });

  if (upstream.status === 204) return new NextResponse(null, { status: 204 });
  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
