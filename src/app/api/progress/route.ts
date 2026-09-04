import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getProgressSummary, getContinueLearning } from "@/lib/services/progress.service";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [summary, continueLearning] = await Promise.all([
    getProgressSummary(user.id),
    getContinueLearning(user.id),
  ]);

  return NextResponse.json({ summary, continueLearning });
}