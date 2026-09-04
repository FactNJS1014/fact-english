import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getQuizRunner } from "@/lib/services/quiz.service";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { quizId } = await params;
  const quiz = await getQuizRunner(quizId);
  if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ quiz });
}