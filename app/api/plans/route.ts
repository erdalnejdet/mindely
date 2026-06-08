import { NextResponse } from "next/server";
import { backendApiUrl } from "@/lib/api-url";

export async function GET() {
  const upstream = await fetch(`${backendApiUrl()}/plans`, { cache: "no-store" });
  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
