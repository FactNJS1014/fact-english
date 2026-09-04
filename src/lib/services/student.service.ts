import { db } from "../db";
import { getUserStreaks, getUserAchievements } from "./gamification.service";
import { getCertificatesForUser } from "./certificate.service";
import { getContinueLearning, getProgressSummary } from "./progress.service";

export async function getStudentDashboard(userId: string) {
  const [user, streaks, continueLearning, summary, achievements, certificates] =
    await Promise.all([
      db.user.findUnique({
        where: { id: userId },
        select: {
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          xp: true,
          currentLevelId: true,
          createdAt: true,
          currentLevel: { select: { name: true, label: true, levelNumber: true } },
        },
      }),
      getUserStreaks(userId),
      getContinueLearning(userId),
      getProgressSummary(userId),
      getUserAchievements(userId),
      getCertificatesForUser(userId),
    ]);

  const [completedLessons, quizAttempts, listeningAttempts, readingPassed, writingCount, bookmarked, activities] =
    await Promise.all([
      db.lessonProgress.count({ where: { userId, completed: true } }),
      db.quizAttempt.findMany({
        where: { userId },
        select: { quizId: true, percentage: true, passed: true },
        take: 400,
      }),
      db.listeningAttempt.findMany({
        where: { userId },
        select: { listeningExerciseId: true, percentage: true, passed: true },
        take: 400,
      }),
      db.readingAttempt.count({ where: { userId, passed: true } }),
      db.writingSubmission.count({ where: { userId } }),
      db.bookmark.count({ where: { userId } }),
      db.learningActivity.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 12,
        select: { kind: true, detail: true, createdAt: true },
      }),
    ]);

  // Per-exercise best average (an attempt list is grouped by exercise id)
  const quizByQuiz = new Map<string, { percentage: number; passed: boolean }>();
  for (const a of quizAttempts) {
    const cur = quizByQuiz.get(a.quizId);
    if (!cur || a.percentage > cur.percentage) {
      quizByQuiz.set(a.quizId, { percentage: a.percentage, passed: a.passed });
    }
  }
  const listeningByEx = new Map<
    string,
    { percentage: number; passed: boolean }
  >();
  for (const a of listeningAttempts) {
    const cur = listeningByEx.get(a.listeningExerciseId);
    if (!cur || a.percentage > cur.percentage) {
      listeningByEx.set(a.listeningExerciseId, {
        percentage: a.percentage,
        passed: a.passed,
      });
    }
  }

  const quizBest = [...quizByQuiz.values()];
  const listeningBest = [...listeningByEx.values()];
  const quizAverage =
    quizBest.length === 0
      ? 0
      : Math.round(quizBest.reduce((s, x) => s + x.percentage, 0) / quizBest.length);
  const listeningAverage =
    listeningBest.length === 0
      ? 0
      : Math.round(
          listeningBest.reduce((s, x) => s + x.percentage, 0) /
            listeningBest.length
        );

  return {
    user,
    streaks,
    continueLearning,
    summary,
    achievements,
    certificates,
    completedLessons,
    quizAverage,
    quizPassed: quizBest.filter((x) => x.passed).length,
    listeningAverage,
    listeningPassed: listeningBest.filter((x) => x.passed).length,
    readingPassed,
    writingCount,
    bookmarked,
    activities,
  };
}

export type StudentDashboardData = Awaited<ReturnType<typeof getStudentDashboard>>;
