import { NextResponse } from "next/server";
import { backendApiUrl } from "@/lib/api-url";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const upstream = await fetch(`${backendApiUrl()}/tests/${slug}`, { next: { revalidate: 60 } });
  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
