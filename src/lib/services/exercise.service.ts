import { db } from "../db";
import { addXpTx, recordActivityTx, awardAchievementsTx } from "./gamification.service";
import { XP, READING_PASS_PERCENT } from "../constants";
import { normalizeAnswer } from "./quiz.service";

interface ReadingQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

export interface ReadingRunnerQuestion {
  id: string;
  question: string;
  options: string[];
}

/** Reading exercises carry correct answers inside JSON — strip them before sending. */
export async function getReadingRunner(exerciseId: string) {
  const exercise = await db.readingExercise.findFirst({
    where: { id: exerciseId, published: "PUBLISHED" },
    include: {
      lesson: {
        select: {
          title: true,
          slug: true,
          topic: {
            select: {
              title: true,
              course: { select: { slug: true, title: true } },
            },
          },
        },
      },
    },
  });
  if (!exercise) return null;

  const questions = (exercise.questions as unknown as ReadingQuestion[]).map(
    (q, i): ReadingRunnerQuestion => ({
      id: String(i),
      question: q.question,
      options: q.options ?? [],
    })
  );

  return {
    id: exercise.id,
    title: exercise.title,
    passage: exercise.passage,
    lesson: exercise.lesson,
    questions,
  };
}

export type ReadingSubmitResult =
  | {
      ok: true;
      attemptId: string;
      score: number;
      totalQuestions: number;
      percentage: number;
      passed: boolean;
      review: {
        question: string;
        userAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
        explanation: string | null;
      }[];
    }
  | { ok: false; error: string };

export async function submitReading(
  userId: string,
  exerciseId: string,
  answers: Record<string, string>
): Promise<ReadingSubmitResult> {
  try {
    return await db.$transaction(
      async (tx) => {
      const exercise = await tx.readingExercise.findUnique({
        where: { id: exerciseId },
      });
      if (!exercise) return { ok: false, error: "Reading exercise not found." };

      const questions = exercise.questions as unknown as ReadingQuestion[];
      let score = 0;
      const review = questions.map((q, i) => {
        const selected = (answers[String(i)] ?? "").trim();
        const isCorrect =
          selected.length > 0 &&
          normalizeAnswer(selected) === normalizeAnswer(q.answer);
        if (isCorrect) score += 1;
        return {
          question: q.question,
          userAnswer: selected,
          correctAnswer: q.answer,
          isCorrect,
          explanation: q.explanation ?? null,
        };
      });

      const total = questions.length;
      const percentage = Math.round((score / total) * 100);
      const passed = percentage >= READING_PASS_PERCENT;

      const alreadyPassed = Boolean(
        await tx.readingAttempt.findFirst({
          where: { userId, readingExerciseId: exerciseId, passed: true },
        })
      );

      const attempt = await tx.readingAttempt.create({
        data: { userId, readingExerciseId: exerciseId, score, totalQuestions: total, percentage, passed },
      });

      if (passed && !alreadyPassed) {
        await addXpTx(tx, userId, XP.READING_PASS);
        await recordActivityTx(tx, userId, "READING", exerciseId);
        await awardAchievementsTx(tx, userId);
      }

      return {
        ok: true,
        attemptId: attempt.id,
        score,
        totalQuestions: total,
        percentage,
        passed,
        review,
      };
      },
      { maxWait: 15000, timeout: 60000 } // slow Neon + achievement checks
    );
  } catch (error) {
    console.error("[exercise.service] reading submit error:", error);
    return { ok: false, error: "We could not save your reading result." };
  }
}

/** Writing & speaking: save the learner's answer with self-review. */
export async function submitWriting(
  userId: string,
  exerciseId: string,
  content: string
): Promise<{ ok: true; updated: boolean } | { ok: false; error: string }> {
  try {
    return await db.$transaction(
      async (tx) => {
      const exercise = await tx.exercise.findUnique({ where: { id: exerciseId } });
      if (!exercise) return { ok: false, error: "Exercise not found." };

      const existing = await tx.writingSubmission.findUnique({
        where: { userId_exerciseId: { userId, exerciseId } },
      });

      await tx.writingSubmission.upsert({
        where: { userId_exerciseId: { userId, exerciseId } },
        create: { userId, exerciseId, content },
        update: { content, selfReviewed: false, updatedAt: new Date() },
      });

      if (!existing) {
        await addXpTx(tx, userId, XP.WRITING_SUBMIT);
        await recordActivityTx(tx, userId, "WRITING", exerciseId);
        await awardAchievementsTx(tx, userId);
      }
      return { ok: true, updated: Boolean(existing) };
      },
      { maxWait: 15000, timeout: 60000 } // slow Neon + achievement checks
    );
  } catch (error) {
    console.error("[exercise.service] writing submit error:", error);
    return { ok: false, error: "We could not save your answer." };
  }
}

export async function markSelfReviewed(
  userId: string,
  exerciseId: string
): Promise<void> {
  await db.writingSubmission.updateMany({
    where: { userId, exerciseId },
    data: { selfReviewed: true },
  });
}

export async function getExerciseById(exerciseId: string) {
  return db.exercise.findFirst({
    where: { id: exerciseId, published: "PUBLISHED" },
    include: {
      lesson: {
        select: {
          title: true,
          slug: true,
          topic: {
            select: {
              title: true,
              course: { select: { slug: true, title: true } },
            },
          },
        },
      },
    },
  });
}

export async function getReadingExerciseById(exerciseId: string) {
  return db.readingExercise.findFirst({
    where: { id: exerciseId, published: "PUBLISHED" },
    include: {
      lesson: {
        select: {
          title: true,
          slug: true,
          topic: {
            select: {
              title: true,
              course: { select: { slug: true, title: true } },
            },
          },
        },
      },
    },
  });
}

export async function getReadingAttempts(userId: string) {
  return db.readingAttempt.findMany({
    where: { userId },
    orderBy: { attemptedAt: "desc" },
    take: 100,
  });
}
