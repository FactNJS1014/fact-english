import { NextResponse } from "next/server";
import { searchContent } from "@/lib/services/content.service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const results = await searchContent(q);
  return NextResponse.json(results);
}