import { NextResponse } from "next/server";
import { backendApiUrl } from "@/lib/api-url";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const upstream = await fetch(`${backendApiUrl()}/psychologists/${id}/slots`, {
    cache: "no-store",
  });
  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
