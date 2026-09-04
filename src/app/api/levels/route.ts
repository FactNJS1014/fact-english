import { NextResponse } from "next/server";
import { getLevelsWithStats } from "@/lib/services/content.service";

export const dynamic = "force-dynamic";

export async function GET() {
  const levels = await getLevelsWithStats();
  return NextResponse.json({ levels });
}