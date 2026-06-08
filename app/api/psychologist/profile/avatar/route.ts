import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendApiUrl } from "@/lib/api-url";
import { ACCESS_COOKIE } from "@/lib/auth-cookies";

export async function POST(request: Request) {
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;
  if (!access) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const incoming = await request.formData();
  const file = incoming.get("avatar");
  if (!(file instanceof Blob) || file.size === 0) {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }

  const outgoing = new FormData();
  outgoing.set("avatar", file, "avatar");

  const upstream = await fetch(`${backendApiUrl()}/psychologist/profile/avatar`, {
    method: "POST",
    headers: { Authorization: `Bearer ${access}` },
    body: outgoing,
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
      typeof data === "object" && data && "error" in data ? data : { error: "AVATAR_UPLOAD_FAILED" },
      { status: upstream.status },
    );
  }

  return NextResponse.json(data);
}
