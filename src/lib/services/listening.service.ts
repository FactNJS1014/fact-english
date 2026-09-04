import { db } from "../db";
import { markListeningPassedTx } from "./progress.service";
import { addXpTx, recordActivityTx, awardAchievementsTx } from "./gamification.service";
import { XP } from "../constants";
import { normalizeAnswer } from "./quiz.service";

export interface ListeningRunnerQuestion {
  id: string;
  question: string;
  type: string;
  order: number;
  points: number;
  options: string[]; // empty for FILL_BLANK
}

/** Load an exercise for the client — correct answers are stripped server-side. */
export async function getListeningRunner(exerciseId: string) {
  const exercise = await db.listeningExercise.findFirst({
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
      questions: { orderBy: { order: "asc" } },
    },
  });
  if (!exercise) return null;

  return {
    id: exercise.id,
    title: exercise.title,
    audioUrl: exercise.audioUrl,
    transcript: exercise.transcript,
    duration: exercise.duration,
    lesson: exercise.lesson,
    questions: exercise.questions.map((q): ListeningRunnerQuestion => ({
      id: q.id,
      question: q.question,
      type: q.type,
      order: q.order,
      points: q.points,
      options: (q.options as string[]) ?? [],
    })),
  };
}

export interface ListeningReviewItem {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string | null;
}

export type ListeningSubmitResult =
  | {
      ok: true;
      attemptId: string;
      score: number;
      totalQuestions: number;
      percentage: number;
      passed: boolean;
      review: ListeningReviewItem[];
    }
  | { ok: false; error: string };

export async function submitListening(
  userId: string,
  exerciseId: string,
  answers: Record<string, string>
): Promise<ListeningSubmitResult> {
  try {
    return await db.$transaction(async (tx) => {
      const exercise = await tx.listeningExercise.findUnique({
        where: { id: exerciseId },
        include: { questions: { orderBy: { order: "asc" } } },
      });
      if (!exercise || exercise.questions.length === 0) {
        return { ok: false, error: "Listening exercise not found." };
      }

      let score = 0;
      const review: ListeningReviewItem[] = [];

      for (const q of exercise.questions) {
        const selected = (answers[q.id] ?? "").trim();
        const options = (q.options as string[]) ?? [];
        const isCorrect =
          selected.length > 0 &&
          normalizeAnswer(selected) === normalizeAnswer(q.answer);
        if (isCorrect) score += 1;
        review.push({
          questionId: q.id,
          question: q.question,
          userAnswer: selected,
          correctAnswer: q.answer,
          isCorrect,
          explanation: q.explanation,
        });
        void options;
      }

      const total = exercise.questions.length;
      const percentage = Math.round((score / total) * 100);
      const passed = percentage >= 70;

      const attempt = await tx.listeningAttempt.create({
        data: {
          userId,
          listeningExerciseId: exerciseId,
          score,
          totalQuestions: total,
          percentage,
          passed,
        },
      });

      if (passed) {
        await markListeningPassedTx(tx, userId, exercise.lessonId);
        await addXpTx(tx, userId, XP.LISTENING_PASS);
        await recordActivityTx(tx, userId, "LISTENING", exerciseId);
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
    });
  } catch (error) {
    console.error("[listening.service] submit error:", error);
    return {
      ok: false,
      error: "We could not save your listening result. Please try again.",
    };
  }
}

export async function getListeningAttemptHistory(userId: string) {
  return db.listeningAttempt.findMany({
    where: { userId },
    orderBy: { completedAt: "desc" },
    take: 200,
  });
}
