import { NextResponse } from "next/server";
import { getCourses } from "@/lib/services/content.service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const levelSlug = url.searchParams.get("level") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;

  const courses = await getCourses({ levelSlug, q });
  return NextResponse.json({ courses });
}