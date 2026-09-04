import { db } from "../db";
import { markQuizPassedTx } from "./progress.service";
import { addXpTx, recordActivityTx, awardAchievementsTx } from "./gamification.service";
import { XP } from "../constants";

export interface QuizRunnerQuestion {
  id: string;
  question: string;
  type: string;
  order: number;
  points: number;
  options: { id: string; text: string; order: number }[];
}

export function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Load a quiz for the client — correct answers NEVER leave the server here. */
export async function getQuizRunner(quizId: string) {
  const quiz = await db.quiz.findFirst({
    where: { id: quizId, published: "PUBLISHED" },
    include: {
      lesson: { select: { title: true, slug: true, topic: { select: { title: true, course: { select: { slug: true, title: true } } } } } },
      questions: {
        orderBy: { order: "asc" },
        include: { options: { orderBy: { order: "asc" } } },
      },
    },
  });
  if (!quiz) return null;

  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    passingScore: quiz.passingScore,
    lesson: quiz.lesson,
    questions: quiz.questions.map((q): QuizRunnerQuestion => ({
      id: q.id,
      question: q.question,
      type: q.type,
      order: q.order,
      points: q.points,
      // FILL_BLANK answers live in the options table — never ship them to the client.
      options:
        q.type === "FILL_BLANK"
          ? []
          : q.options.map((o) => ({ id: o.id, text: o.text, order: o.order })),
    })),
  };
}

export interface QuizReviewItem {
  questionId: string;
  question: string;
  type: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string | null;
  options: { id: string; text: string }[];
}

export type QuizSubmitResult =
  | {
      ok: true;
      attemptId: string;
      score: number;
      totalQuestions: number;
      percentage: number;
      passed: boolean;
      perfect: boolean;
      passingScore: number;
      review: QuizReviewItem[];
    }
  | { ok: false; error: string };

export async function submitQuiz(
  userId: string,
  quizId: string,
  answers: Record<string, string>
): Promise<QuizSubmitResult> {
  try {
    return await db.$transaction(async (tx) => {
      const quiz = await tx.quiz.findUnique({
        where: { id: quizId },
        include: {
          questions: {
            orderBy: { order: "asc" },
            include: { options: { orderBy: { order: "asc" } } },
          },
        },
      });
      if (!quiz || quiz.questions.length === 0) {
        return { ok: false, error: "Quiz not found." };
      }

      let score = 0;
      const review: QuizReviewItem[] = [];

      for (const q of quiz.questions) {
        const selected = (answers[q.id] ?? "").trim();
        let isCorrect = false;

        if (q.type === "FILL_BLANK" || q.options.length === 0) {
          // Free-text answer — compare against the canonical correct option.
          const canonical = q.options.find((o) => o.isCorrect);
          isCorrect =
            Boolean(canonical) &&
            normalizeAnswer(selected) === normalizeAnswer(canonical?.text ?? "");
        } else if (selected) {
          const chosen = q.options.find((o) => o.id === selected);
          isCorrect = chosen?.isCorrect ?? false;
        }

        if (isCorrect) score += 1;

        const correctText = q.options
          .filter((o) => o.isCorrect)
          .map((o) => o.text)
          .join(", ");
        review.push({
          questionId: q.id,
          question: q.question,
          type: q.type,
          userAnswer: selected,
          correctAnswer: correctText,
          isCorrect,
          explanation: q.explanation,
          options: q.options.map((o) => ({ id: o.id, text: o.text })),
        });
      }

      const total = quiz.questions.length;
      const percentage = Math.round((score / total) * 100);
      const passed = percentage >= quiz.passingScore;

      const attempt = await tx.quizAttempt.create({
        data: {
          userId,
          quizId,
          score,
          totalQuestions: total,
          percentage,
          passed,
          answers: {
            create: review.map((r) => ({
              questionId: r.questionId,
              selectedAnswer: r.userAnswer,
              isCorrect: r.isCorrect,
            })),
          },
        },
      });

      if (passed) {
        await markQuizPassedTx(tx, userId, quiz.lessonId);
        await addXpTx(tx, userId, XP.QUIZ_PASS);
        if (percentage === 100) await addXpTx(tx, userId, XP.QUIZ_PERFECT_BONUS);
        await recordActivityTx(tx, userId, "QUIZ", quizId);
        await awardAchievementsTx(tx, userId);
      }

      return {
        ok: true,
        attemptId: attempt.id,
        score,
        totalQuestions: total,
        percentage,
        passed,
        perfect: percentage === 100,
        passingScore: quiz.passingScore,
        review,
      };
    });
  } catch (error) {
    console.error("[quiz.service] submit error:", error);
    return { ok: false, error: "We could not save your quiz. Please try again." };
  }
}

/** Attempt history per quiz (list page / dashboard averages). */
export async function getQuizAttemptHistory(userId: string, quizId?: string) {
  return db.quizAttempt.findMany({
    where: { userId, ...(quizId ? { quizId } : {}) },
    orderBy: { completedAt: "desc" },
    take: quizId ? 20 : 200,
    include: quizId ? undefined : { quiz: { select: { title: true } } },
  });
}
