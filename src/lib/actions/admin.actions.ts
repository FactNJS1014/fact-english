"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { requireActionAdmin } from "./action-helpers";
import {
  levelSchema,
  courseSchema,
  topicSchema,
  lessonSchema,
  vocabularySchema,
  grammarSchema,
  listeningSchema,
  quizSchema,
  readingExerciseSchema,
  exerciseSchema,
  adminUserSchema,
} from "../validations";
import { zodErrors } from "./action-helpers";
import {
  adminCreateLevel,
  adminUpdateLevel,
  adminDeleteLevel,
  adminReorderLevel,
  adminCreateCourse,
  adminUpdateCourse,
  adminDeleteCourse,
  adminReorderInLevel,
  adminCreateTopic,
  adminUpdateTopic,
  adminDeleteTopic,
  adminCreateLesson,
  adminUpdateLesson,
  adminDeleteLesson,
  adminCreateVocabulary,
  adminUpdateVocabulary,
  adminDeleteVocabulary,
  adminCreateGrammar,
  adminUpdateGrammar,
  adminDeleteGrammar,
  adminCreateListening,
  adminUpdateListening,
  adminDeleteListening,
  adminCreateQuiz,
  adminUpdateQuiz,
  adminDeleteQuiz,
  adminReplaceQuizQuestions,
  adminReplaceListeningQuestions,
  adminReplaceReadingQuestions,
  adminCreateReading,
  adminUpdateReading,
  adminDeleteReading,
  adminCreateExercise,
  adminUpdateExercise,
  adminDeleteExercise,
  updateUserStatus,
  resetUserProgress,
} from "../services/admin.service";

type EntityKind =
  | "level"
  | "course"
  | "topic"
  | "lesson"
  | "vocabulary"
  | "grammar"
  | "listening"
  | "quiz"
  | "reading"
  | "exercise";

const ENTITY_PATHS: Record<EntityKind, string> = {
  level: "/admin/levels",
  course: "/admin/courses",
  topic: "/admin/topics",
  lesson: "/admin/lessons",
  vocabulary: "/admin/vocabulary",
  grammar: "/admin/grammar",
  listening: "/admin/listening",
  quiz: "/admin/quizzes",
  reading: "/admin/exercises",
  exercise: "/admin/exercises",
};

function linesOf(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function fail(kind: EntityKind, message: string): never {
  redirect(`${ENTITY_PATHS[kind]}?error=${encodeURIComponent(message)}`);
}

export async function saveEntityAction(formData: FormData): Promise<void> {
  const admin = await requireActionAdmin();
  if (!admin) redirect("/login?expired=1&redirect=/admin");
  const kind = formData.get("kind") as EntityKind;
  const id = (formData.get("id") as string) || null;

  switch (kind) {
    case "level": {
      const parsed = levelSchema.safeParse({
        name: formData.get("name"),
        label: formData.get("label"),
        slug: formData.get("slug") || undefined,
        description: formData.get("description"),
        levelNumber: formData.get("levelNumber"),
        published: formData.get("published"),
      });
      if (!parsed.success) fail(kind, zodErrors(parsed.error)[0] ?? "Invalid level data");
      if (id) await adminUpdateLevel(id, parsed.data);
      else await adminCreateLevel(parsed.data);
      break;
    }
    case "course": {
      const parsed = courseSchema.safeParse({
        levelId: formData.get("levelId"),
        title: formData.get("title"),
        slug: formData.get("slug") || undefined,
        shortDescription: formData.get("shortDescription"),
        description: formData.get("description"),
        thumbnail: formData.get("thumbnail") || null,
        order: formData.get("order"),
        published: formData.get("published"),
      });
      if (!parsed.success) fail(kind, zodErrors(parsed.error)[0] ?? "Invalid course data");
      if (id) await adminUpdateCourse(id, parsed.data);
      else await adminCreateCourse(parsed.data);
      break;
    }
    case "topic": {
      const parsed = topicSchema.safeParse({
        courseId: formData.get("courseId"),
        title: formData.get("title"),
        slug: formData.get("slug") || undefined,
        description: formData.get("description"),
        order: formData.get("order"),
        difficulty: formData.get("difficulty"),
        published: formData.get("published"),
      });
      if (!parsed.success) fail(kind, zodErrors(parsed.error)[0] ?? "Invalid topic data");
      if (id) await adminUpdateTopic(id, parsed.data);
      else await adminCreateTopic(parsed.data);
      break;
    }
    case "lesson": {
      const parsed = lessonSchema.safeParse({
        topicId: formData.get("topicId"),
        title: formData.get("title"),
        slug: formData.get("slug") || undefined,
        content: formData.get("content"),
        objectives: linesOf(formData.get("objectives")),
        summary: formData.get("summary") || null,
        order: formData.get("order"),
        durationMinutes: formData.get("durationMinutes"),
        published: formData.get("published"),
      });
      if (!parsed.success) fail(kind, zodErrors(parsed.error)[0] ?? "Invalid lesson data");
      if (id) await adminUpdateLesson(id, parsed.data);
      else await adminCreateLesson(parsed.data);
      break;
    }
    case "vocabulary": {
      const parsed = vocabularySchema.safeParse({
        lessonId: formData.get("lessonId"),
        word: formData.get("word"),
        pronunciation: formData.get("pronunciation") || null,
        partOfSpeech: formData.get("partOfSpeech"),
        thaiMeaning: formData.get("thaiMeaning") || null,
        meaning: formData.get("meaning"),
        example: formData.get("example"),
        businessExample: formData.get("businessExample"),
        audioUrl: formData.get("audioUrl") || null,
      });
      if (!parsed.success) fail(kind, zodErrors(parsed.error)[0] ?? "Invalid vocabulary data");
      if (id) await adminUpdateVocabulary(id, parsed.data);
      else await adminCreateVocabulary(parsed.data);
      break;
    }
    case "grammar": {
      const parsed = grammarSchema.safeParse({
        topicId: formData.get("topicId"),
        title: formData.get("title"),
        explanation: formData.get("explanation"),
        structure: formData.get("structure"),
        examples: linesOf(formData.get("examples")),
        businessExamples: linesOf(formData.get("businessExamples")),
        commonMistakes: linesOf(formData.get("commonMistakes")),
      });
      if (!parsed.success) fail(kind, zodErrors(parsed.error)[0] ?? "Invalid grammar data");
      if (id) await adminUpdateGrammar(id, parsed.data);
      else await adminCreateGrammar(parsed.data);
      break;
    }
    case "listening": {
      const parsed = listeningSchema.safeParse({
        lessonId: formData.get("lessonId"),
        title: formData.get("title"),
        audioUrl: formData.get("audioUrl") || null,
        transcript: formData.get("transcript"),
        duration: formData.get("duration"),
        published: formData.get("published"),
      });
      if (!parsed.success) fail(kind, zodErrors(parsed.error)[0] ?? "Invalid listening data");
      if (id) await adminUpdateListening(id, parsed.data);
      else await adminCreateListening(parsed.data);
      break;
    }
    case "quiz": {
      const parsed = quizSchema.safeParse({
        lessonId: formData.get("lessonId"),
        title: formData.get("title"),
        description: formData.get("description") || null,
        passingScore: formData.get("passingScore"),
        published: formData.get("published"),
      });
      if (!parsed.success) fail(kind, zodErrors(parsed.error)[0] ?? "Invalid quiz data");
      if (id) await adminUpdateQuiz(id, parsed.data);
      else await adminCreateQuiz(parsed.data);
      break;
    }
    case "reading": {
      const parsed = readingExerciseSchema.safeParse({
        lessonId: formData.get("lessonId"),
        title: formData.get("title"),
        passage: formData.get("passage"),
        published: formData.get("published"),
        order: formData.get("order"),
      });
      if (!parsed.success) fail(kind, zodErrors(parsed.error)[0] ?? "Invalid reading data");
      if (id) await adminUpdateReading(id, parsed.data);
      else await adminCreateReading(parsed.data);
      break;
    }
    case "exercise": {
      const contentRaw = String(formData.get("content") ?? "{}");
      let content: unknown = {};
      try {
        content = JSON.parse(contentRaw);
      } catch {
        fail(kind, "Content must be valid JSON (e.g. { \"modelAnswer\": \"…\" })");
      }
      const parsed = exerciseSchema.safeParse({
        lessonId: formData.get("lessonId"),
        kind: formData.get("kind"),
        title: formData.get("title"),
        prompt: formData.get("prompt"),
        content: contentRaw,
        published: formData.get("published"),
        order: formData.get("order"),
      });
      if (!parsed.success) fail(kind, zodErrors(parsed.error)[0] ?? "Invalid exercise data");
      if (id) await adminUpdateExercise(id, { ...parsed.data, content });
      else await adminCreateExercise({ ...parsed.data, content });
      break;
    }
    default:
      fail("level", "Unknown entity");
  }

  const returnTo = String(formData.get("returnTo") || ENTITY_PATHS[kind]);
  revalidatePath(ENTITY_PATHS[kind]);
  revalidatePath("/");
  redirect(`${returnTo}?saved=1`);
}

export async function deleteEntityAction(formData: FormData): Promise<void> {
  const admin = await requireActionAdmin();
  if (!admin) redirect("/login?expired=1&redirect=/admin");
  const kind = formData.get("kind") as EntityKind;
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  switch (kind) {
    case "level": await adminDeleteLevel(id); break;
    case "course": await adminDeleteCourse(id); break;
    case "topic": await adminDeleteTopic(id); break;
    case "lesson": await adminDeleteLesson(id); break;
    case "vocabulary": await adminDeleteVocabulary(id); break;
    case "grammar": await adminDeleteGrammar(id); break;
    case "listening": await adminDeleteListening(id); break;
    case "quiz": await adminDeleteQuiz(id); break;
    case "reading": await adminDeleteReading(id); break;
    case "exercise": await adminDeleteExercise(id); break;
    default: return;
  }

  const returnTo = String(formData.get("returnTo") || ENTITY_PATHS[kind]);
  revalidatePath(ENTITY_PATHS[kind]);
  revalidatePath("/");
  redirect(`${returnTo}?deleted=1`);
}

export async function reorderEntityAction(formData: FormData): Promise<void> {
  const admin = await requireActionAdmin();
  if (!admin) redirect("/login?expired=1&redirect=/admin");
  const kind = formData.get("kind") as "level" | "course" | "topic";
  const id = String(formData.get("id") ?? "");
  const direction = String(formData.get("direction") ?? "up") as "up" | "down";
  if (kind === "level") await adminReorderLevel(id, direction);
  if (kind === "course") await adminReorderInLevel("course", id, direction, {});
  if (kind === "topic") await adminReorderInLevel("topic", id, direction, {});
  const returnTo = String(formData.get("returnTo") || `/admin/${kind}s`);
  revalidatePath(returnTo);
  redirect(`${returnTo}?reordered=1`);
}

export async function replaceQuizQuestionsAction(
  quizId: string,
  questionsJson: string
): Promise<{ ok: boolean; error?: string }> {
  const admin = await requireActionAdmin();
  if (!admin) return { ok: false, error: "Unauthorized" };
  try {
    const parsed = JSON.parse(questionsJson);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return { ok: false, error: "Provide a JSON array of questions." };
    }
    const questions = parsed.map(
      (q: Record<string, unknown>, i: number) => ({
        question: String(q.question ?? ""),
        type: String(q.type ?? "MULTIPLE_CHOICE"),
        order: Number(q.order ?? i),
        points: Number(q.points ?? 5),
        explanation: q.explanation ? String(q.explanation) : null,
        options: Array.isArray(q.options)
          ? (q.options as { text: string; isCorrect?: boolean }[]).map(
              (o, oi) => ({
                text: String(o.text ?? ""),
                isCorrect: Boolean(o.isCorrect),
                order: Number((o as { order?: number }).order ?? oi),
              })
            )
          : [],
      })
    );
    await adminReplaceQuizQuestions(quizId, questions);
    revalidatePath("/admin/quizzes");
    return { ok: true };
  } catch {
    return { ok: false, error: "Questions must be valid JSON." };
  }
}

export async function replaceListeningQuestionsAction(
  exerciseId: string,
  questionsJson: string
): Promise<{ ok: boolean; error?: string }> {
  const admin = await requireActionAdmin();
  if (!admin) return { ok: false, error: "Unauthorized" };
  try {
    const parsed = JSON.parse(questionsJson);
    if (!Array.isArray(parsed)) return { ok: false, error: "Provide a JSON array." };
    const questions = parsed.map((q: Record<string, unknown>, i: number) => ({
      question: String(q.question ?? ""),
      type: String(q.type ?? "MULTIPLE_CHOICE"),
      options: Array.isArray(q.options) ? (q.options as string[]).map(String) : [],
      answer: String(q.answer ?? ""),
      explanation: q.explanation ? String(q.explanation) : null,
      order: Number(q.order ?? i),
      points: Number(q.points ?? 20),
    }));
    await adminReplaceListeningQuestions(exerciseId, questions);
    revalidatePath("/admin/listening");
    return { ok: true };
  } catch {
    return { ok: false, error: "Questions must be valid JSON." };
  }
}

export async function replaceReadingQuestionsAction(
  readingId: string,
  questionsJson: string
): Promise<{ ok: boolean; error?: string }> {
  const admin = await requireActionAdmin();
  if (!admin) return { ok: false, error: "Unauthorized" };
  try {
    const parsed = JSON.parse(questionsJson);
    if (!Array.isArray(parsed)) return { ok: false, error: "Provide a JSON array." };
    const questions = parsed.map((q: Record<string, unknown>) => ({
      question: String(q.question ?? ""),
      options: Array.isArray(q.options) ? (q.options as string[]).map(String) : [],
      answer: String(q.answer ?? ""),
      explanation: q.explanation ? String(q.explanation) : null,
    }));
    await adminReplaceReadingQuestions(readingId, questions);
    revalidatePath("/admin/exercises");
    return { ok: true };
  } catch {
    return { ok: false, error: "Questions must be valid JSON." };
  }
}

export async function patchUserAction(
  id: string,
  patch: { isActive?: boolean; role?: Role; bypassLevelLock?: boolean }
): Promise<{ ok: boolean; error?: string }> {
  const admin = await requireActionAdmin();
  if (!admin) return { ok: false, error: "Unauthorized" };
  const parsed = adminUserSchema.safeParse(patch);
  if (!parsed.success) return { ok: false, error: "Invalid patch" };
  await updateUserStatus(id, parsed.data);
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function resetUserProgressAction(
  userId: string
): Promise<{ ok: boolean; error?: string }> {
  const admin = await requireActionAdmin();
  if (!admin) return { ok: false, error: "Unauthorized" };
  await resetUserProgress(userId);
  revalidatePath("/admin/users");
  return { ok: true };
}

