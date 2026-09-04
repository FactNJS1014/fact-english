import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getListeningRunner } from "@/lib/services/listening.service";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ exerciseId: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { exerciseId } = await params;
  const exercise = await getListeningRunner(exerciseId);
  if (!exercise) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ exercise });
}