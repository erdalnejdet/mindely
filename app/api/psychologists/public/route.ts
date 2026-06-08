import { NextResponse } from "next/server";
import { backendApiUrl } from "@/lib/api-url";

export async function GET() {
  const upstream = await fetch(`${backendApiUrl()}/psychologists/public`, { cache: "no-store" });
  const raw = await upstream.text();
  let data: unknown;
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    return NextResponse.json({ error: "BAD_GATEWAY" }, { status: 502 });
  }
  if (!upstream.ok) {
    return NextResponse.json(
      typeof data === "object" && data && "error" in data ? data : { error: "LIST_FAILED" },
      { status: upstream.status },
    );
  }
  return NextResponse.json(data);
}
