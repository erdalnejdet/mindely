import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendApiUrl } from "@/lib/api-url";
import { ACCESS_COOKIE } from "@/lib/auth-cookies";

type PatchBody = { bio?: string | null; title?: string | null; name?: string | null };

export async function PATCH(request: Request) {
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;
  if (!access) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const upstream = await fetch(`${backendApiUrl()}/psychologist/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
    },
    body: JSON.stringify(body),
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
      typeof data === "object" && data && "error" in data ? data : { error: "PROFILE_UPDATE_FAILED" },
      { status: upstream.status },
    );
  }

  return NextResponse.json(data);
}
