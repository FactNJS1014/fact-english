"use server";

import { revalidatePath } from "next/cache";
import { db } from "../db";
import {
  quizSubmitSchema,
  listeningSubmitSchema,
  readingSubmitSchema,
  writingSubmitSchema,
  noteSchema,
  bookmarkSchema,
} from "../validations";
import {
  requireActionUser,
  UNAUTHENTICATED,
  type ActionResult,
} from "./action-helpers";
import { submitQuiz, type QuizSubmitResult } from "../services/quiz.service";
import { submitListening, type ListeningSubmitResult } from "../services/listening.service";
import {
  submitReading,
  submitWriting,
  markSelfReviewed,
  type ReadingSubmitResult,
} from "../services/exercise.service";
import { viewLesson } from "../services/progress.service";

function safeLessonPath(path?: string): string | null {
  return path && path.startsWith("/learn/") && !path.startsWith("/learn//")
    ? path
    : null;
}

async function revalidateLearning(path?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/progress");
  if (safeLessonPath(path)) revalidatePath(safeLessonPath(path)!);
}

export async function viewLessonAction(lessonId: string): Promise<ActionResult> {
  const user = await requireActionUser();
  if (!user) return UNAUTHENTICATED;
  try {
    await viewLesson(user.id, lessonId);
    revalidatePath("/dashboard");
    revalidatePath("/progress");
    revalidatePath("/learn");
    return { ok: true, message: "Lesson progress saved." };
  } catch {
    return { ok: false, error: "Could not save progress." };
  }
}

export async function submitQuizAction(
  quizId: string,
  answers: Record<string, string>,
  lessonPath?: string
): Promise<ActionResult & { result?: QuizSubmitResult }> {
  const user = await requireActionUser();
  if (!user) return UNAUTHENTICATED;
  const parsed = quizSubmitSchema.safeParse({ quizId, answers });
  if (!parsed.success) return { ok: false, error: "Invalid submission." };

  const result = await submitQuiz(user.id, parsed.data.quizId, parsed.data.answers);
  if (!result.ok) return result;
  await revalidateLearning(lessonPath);
  return { ok: true, message: result.passed ? "Quiz passed — well done!" : "Quiz submitted.", result };
}

export async function submitListeningAction(
  exerciseId: string,
  answers: Record<string, string>,
  lessonPath?: string
): Promise<ActionResult & { result?: ListeningSubmitResult }> {
  const user = await requireActionUser();
  if (!user) return UNAUTHENTICATED;
  const parsed = listeningSubmitSchema.safeParse({ exerciseId, answers });
  if (!parsed.success) return { ok: false, error: "Invalid submission." };

  const result = await submitListening(user.id, parsed.data.exerciseId, parsed.data.answers);
  if (!result.ok) return result;
  await revalidateLearning(lessonPath);
  return { ok: true, message: result.passed ? "Listening passed!" : "Listening submitted.", result };
}

export async function submitReadingAction(
  exerciseId: string,
  answers: Record<string, string>,
  lessonPath?: string
): Promise<ActionResult & { result?: ReadingSubmitResult }> {
  const user = await requireActionUser();
  if (!user) return UNAUTHENTICATED;
  const parsed = readingSubmitSchema.safeParse({ exerciseId, answers });
  if (!parsed.success) return { ok: false, error: "Invalid submission." };

  const result = await submitReading(user.id, parsed.data.exerciseId, parsed.data.answers);
  if (!result.ok) return result;
  await revalidateLearning(lessonPath);
  return { ok: true, message: result.passed ? "Reading passed!" : "Reading submitted.", result };
}

export async function submitWritingAction(
  exerciseId: string,
  content: string,
  lessonPath?: string
): Promise<ActionResult> {
  const user = await requireActionUser();
  if (!user) return UNAUTHENTICATED;
  const parsed = writingSubmitSchema.safeParse({ exerciseId, content });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Please write a longer answer.",
    };
  }
  const result = await submitWriting(user.id, exerciseId, content);
  if (!result.ok) return result;
  await revalidateLearning(lessonPath);
  return { ok: true, message: "Saved. Review your answer and compare with the model text." };
}

export async function markSelfReviewedAction(
  exerciseId: string
): Promise<ActionResult> {
  const user = await requireActionUser();
  if (!user) return UNAUTHENTICATED;
  await markSelfReviewed(user.id, exerciseId);
  return { ok: true, message: "Marked as reviewed." };
}

export async function toggleBookmarkAction(
  targetKind: "LESSON" | "COURSE",
  targetId: string,
  returnPath: string
): Promise<ActionResult> {
  const user = await requireActionUser();
  if (!user) return UNAUTHENTICATED;
  const parsed = bookmarkSchema.safeParse({ targetKind, targetId });
  if (!parsed.success) return { ok: false, error: "Invalid bookmark." };

  const existing = await db.bookmark.findUnique({
    where: {
      userId_targetKind_targetId: {
        userId: user.id,
        targetKind: parsed.data.targetKind,
        targetId: parsed.data.targetId,
      },
    },
  });
  if (existing) {
    await db.bookmark.delete({ where: { id: existing.id } });
  } else {
    await db.bookmark.create({
      data: {
        userId: user.id,
        targetKind: parsed.data.targetKind,
        targetId: parsed.data.targetId,
      },
    });
  }
  if (returnPath.startsWith("/")) revalidatePath(returnPath);
  revalidatePath("/bookmarks");
  return { ok: true, message: existing ? "Bookmark removed." : "Bookmark saved." };
}

export async function saveNoteAction(
  lessonId: string,
  content: string,
  returnPath: string
): Promise<ActionResult> {
  const user = await requireActionUser();
  if (!user) return UNAUTHENTICATED;
  const parsed = noteSchema.safeParse({ lessonId, content });
  if (!parsed.success) return { ok: false, error: "Note is empty." };

  await db.$transaction([
    db.note.deleteMany({ where: { userId: user.id, lessonId } }),
    db.note.create({
      data: { userId: user.id, lessonId, content: parsed.data.content },
    }),
  ]);
  if (returnPath.startsWith("/")) revalidatePath(returnPath);
  return { ok: true, message: "Note saved." };
}

export async function deleteNoteAction(
  lessonId: string,
  returnPath: string
): Promise<ActionResult> {
  const user = await requireActionUser();
  if (!user) return UNAUTHENTICATED;
  await db.note.deleteMany({ where: { userId: user.id, lessonId } });
  if (returnPath.startsWith("/")) revalidatePath(returnPath);
  return { ok: true, message: "Note deleted." };
}


