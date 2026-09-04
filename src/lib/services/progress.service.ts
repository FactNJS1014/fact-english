import { db } from "../db";
import type { Prisma } from "@prisma/client";
import { XP } from "../constants";
import {
  addXpTx,
  recordActivityTx,
  awardAchievementsTx,
} from "./gamification.service";
import { issueCertificateForLevelTx } from "./certificate.service";

export type Tx = Prisma.TransactionClient;
export type ProgressComponent = "reading" | "listening" | "quiz";

function lessonPercentOf(reading: boolean, listening: boolean, quiz: boolean) {
  const parts = [reading, listening, quiz].filter(Boolean).length;
  return Math.round((parts / 3) * 100);
}

/** Apply one completion component inside the caller's transaction. */
export async function applyLessonComponentTx(
  tx: Tx,
  userId: string,
  lessonId: string,
  component: ProgressComponent
) {
  const lesson = await tx.lesson.findUnique({
    where: { id: lessonId },
    select: {
      topicId: true,
      topic: {
        select: { courseId: true, course: { select: { levelId: true } } },
      },
    },
  });
  if (!lesson) return;

  const key = { userId_lessonId: { userId, lessonId } };
  const existing = await tx.lessonProgress.upsert({
    where: key,
    create: {
      userId,
      lessonId,
      readingCompleted: component === "reading",
      listeningCompleted: component === "listening",
      quizCompleted: component === "quiz",
      lastViewedAt: new Date(),
    },
    update: {},
  });

  const reading =
    existing.readingCompleted || component === "reading";
  const listening =
    existing.listeningCompleted || component === "listening";
  const quiz = existing.quizCompleted || component === "quiz";
  const percent = lessonPercentOf(reading, listening, quiz);
  const completed = reading && listening && quiz;

  await tx.lessonProgress.update({
    where: key,
    data: {
      readingCompleted: reading,
      listeningCompleted: listening,
      quizCompleted: quiz,
      progressPercent: percent,
      completed,
      completedAt: completed && !existing.completed ? new Date() : existing.completedAt,
      lastViewedAt: new Date(),
    },
  });

  if (!completed || existing.completed) return;

  // First time the lesson is fully completed → XP, activity, achievements, roll-up.
  await addXpTx(tx, userId, XP.LESSON_COMPLETE);
  await recordActivityTx(tx, userId, "LESSON", lessonId);
  await awardAchievementsTx(tx, userId);

  await rollUpTopicTx(
    tx,
    userId,
    lesson.topicId,
    lesson.topic.courseId,
    lesson.topic.course.levelId
  );
}

async function rollUpTopicTx(
  tx: Tx,
  userId: string,
  topicId: string,
  courseId: string,
  levelId: string
) {
  const lessons = await tx.lesson.findMany({
    where: { topicId, published: "PUBLISHED" },
    select: { id: true },
  });
  if (lessons.length === 0) return;

  const done = await tx.lessonProgress.count({
    where: { userId, lessonId: { in: lessons.map((l) => l.id) }, completed: true },
  });
  const percent = Math.round((done / lessons.length) * 100);
  const completedNow = percent === 100;

  const prev = await tx.topicProgress.findUnique({
    where: { userId_topicId: { userId, topicId } },
  });
  const changed =
    !prev || prev.percent !== percent || prev.completed !== completedNow;
  if (changed) {
    await tx.topicProgress.upsert({
      where: { userId_topicId: { userId, topicId } },
      create: { userId, topicId, percent, completed: completedNow },
      update: { percent, completed: completedNow },
    });
  }

  if (completedNow && !prev?.completed) {
    await rollUpCourseTx(tx, userId, courseId, levelId);
  }
}

async function rollUpCourseTx(
  tx: Tx,
  userId: string,
  courseId: string,
  levelId: string
) {
  const topics = await tx.topic.findMany({
    where: { courseId, published: "PUBLISHED" },
    select: { id: true },
  });
  if (topics.length === 0) return;

  const progress = await tx.topicProgress.findMany({
    where: { userId, topicId: { in: topics.map((t) => t.id) } },
    select: { topicId: true, percent: true },
  });
  const map = new Map(progress.map((p) => [p.topicId, p.percent]));
  const total = topics.reduce((sum, t) => sum + (map.get(t.id) ?? 0), 0);
  const percent = Math.round(total / topics.length);
  const completedNow = percent === 100;

  const prev = await tx.courseProgress.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  const changed = !prev || prev.percent !== percent || prev.completed !== completedNow;
  if (changed) {
    await tx.courseProgress.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: { userId, courseId, percent, completed: completedNow },
      update: { percent, completed: completedNow },
    });
  }

  if (completedNow && !prev?.completed) {
    await addXpTx(tx, userId, XP.COURSE_COMPLETE);
    await recordActivityTx(tx, userId, "COURSE", courseId);
    await awardAchievementsTx(tx, userId);
  }

  // Level percent refreshes on every course progress change (not only completion).
  if (changed) {
    await rollUpLevelTx(tx, userId, levelId);
  }
}

async function rollUpLevelTx(tx: Tx, userId: string, levelId: string) {
  const courses = await tx.course.findMany({
    where: { levelId, published: "PUBLISHED" },
    select: { id: true },
  });
  if (courses.length === 0) return;

  const progress = await tx.courseProgress.findMany({
    where: { userId, courseId: { in: courses.map((c) => c.id) } },
    select: { courseId: true, percent: true },
  });
  const map = new Map(progress.map((p) => [p.courseId, p.percent]));
  const total = courses.reduce((sum, c) => sum + (map.get(c.id) ?? 0), 0);
  const percent = Math.round(total / courses.length);
  const completedNow = percent === 100;

  const prev = await tx.levelProgress.findUnique({
    where: { userId_levelId: { userId, levelId } },
  });
  const changed = !prev || prev.percent !== percent || prev.completed !== completedNow;
  if (changed) {
    await tx.levelProgress.upsert({
      where: { userId_levelId: { userId, levelId } },
      create: { userId, levelId, percent, completed: completedNow },
      update: { percent, completed: completedNow },
    });
  }

  if (completedNow && !prev?.completed) {
    const cert = await issueCertificateForLevelTx(tx, userId, levelId);
    if (cert.created) {
      await addXpTx(tx, userId, XP.LEVEL_COMPLETE);
      await recordActivityTx(tx, userId, "LEVEL", levelId);
      await awardAchievementsTx(tx, userId);
    }
  }
}

// ---------------------------------------------------------------- public entry points

export async function viewLesson(userId: string, lessonId: string) {
  await db.$transaction(async (tx) => {
    await applyLessonComponentTx(tx, userId, lessonId, "reading");
  });
}

export async function markQuizPassedTx(tx: Tx, userId: string, lessonId: string) {
  await applyLessonComponentTx(tx, userId, lessonId, "quiz");
}

export async function markListeningPassedTx(
  tx: Tx,
  userId: string,
  lessonId: string
) {
  await applyLessonComponentTx(tx, userId, lessonId, "listening");
}

export async function setCurrentLevel(userId: string, levelId: string) {
  await db.user.update({
    where: { id: userId },
    data: { currentLevelId: levelId },
  });
}

// ---------------------------------------------------------------- reads

export interface LevelAccess {
  levelId: string;
  levelNumber: number;
  name: string;
  label: string;
  slug: string;
  unlocked: boolean;
  completed: boolean;
  percent: number;
}

export async function getLevelAccessMap(userId: string): Promise<
  Record<string, LevelAccess>
> {
  const [user, levels, progress] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: { bypassLevelLock: true },
    }),
    db.level.findMany({
      where: { published: "PUBLISHED" },
      orderBy: { levelNumber: "asc" },
      select: { id: true, levelNumber: true, name: true, label: true, slug: true },
    }),
    db.levelProgress.findMany({
      where: { userId },
      select: { levelId: true, completed: true, percent: true },
    }),
  ]);

  const progressMap = new Map(progress.map((p) => [p.levelId, p]));
  const result: Record<string, LevelAccess> = {};
  let previousCompleted = true; // level 1 is always open

  for (const level of levels) {
    const p = progressMap.get(level.id);
    const unlocked =
      user?.bypassLevelLock === true || previousCompleted;
    result[level.id] = {
      levelId: level.id,
      levelNumber: level.levelNumber,
      name: level.name,
      label: level.label,
      slug: level.slug,
      unlocked,
      completed: p?.completed ?? false,
      percent: p?.percent ?? 0,
    };
    previousCompleted = p?.completed ?? false;
  }
  return result;
}

export interface LessonUnlockCtx {
  levelId: string;
  courseId: string;
  topicId: string;
  topicOrder: number;
}

export async function getLessonUnlocked(
  userId: string,
  ctx: LessonUnlockCtx
): Promise<{ unlocked: boolean; reason?: "level" | "previous-topic" }> {
  const access = await getLevelAccessMap(userId);
  const level = access[ctx.levelId];
  if (!level || !level.unlocked) return { unlocked: false, reason: "level" };

  if (ctx.topicOrder > 0) {
    const prev = await db.topic.findFirst({
      where: { courseId: ctx.courseId, order: ctx.topicOrder - 1 },
      select: { id: true },
    });
    if (prev) {
      const prevProgress = await db.topicProgress.findUnique({
        where: { userId_topicId: { userId, topicId: prev.id } },
        select: { completed: true },
      });
      if (!prevProgress?.completed) {
        return { unlocked: false, reason: "previous-topic" };
      }
    }
  }
  return { unlocked: true };
}

export async function getLessonProgressRow(userId: string, lessonId: string) {
  return db.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });
}

export async function getProgressSummary(userId: string) {
  const [accessMap, levels, overall] = await Promise.all([
    getLevelAccessMap(userId),
    db.level.findMany({
      where: { published: "PUBLISHED" },
      orderBy: { levelNumber: "asc" },
      select: { id: true, name: true, label: true, levelNumber: true },
    }),
    db.lesson.findMany({
      where: { published: "PUBLISHED" },
      select: { id: true },
    }),
  ]);

  const totalPublishedLessons = overall.length;
  const done = await db.lessonProgress.count({
    where: { userId, completed: true },
  });
  const overallPercent =
    totalPublishedLessons === 0
      ? 0
      : Math.round((done / totalPublishedLessons) * 100);

  return {
    levels: levels.map((l) => accessMap[l.id]),
    overallPercent,
  };
}

export async function getContinueLearning(userId: string) {
  const row = await db.lessonProgress.findFirst({
    where: { userId },
    orderBy: { lastViewedAt: "desc" },
    include: {
      lesson: {
        include: {
          topic: {
            include: { course: { select: { title: true, slug: true } } },
          },
        },
      },
    },
  });
  if (!row) return null;
  return {
    lessonId: row.lessonId,
    lessonTitle: row.lesson.title,
    lessonSlug: row.lesson.slug,
    topicTitle: row.lesson.topic.title,
    courseTitle: row.lesson.topic.course.title,
    courseSlug: row.lesson.topic.course.slug,
    progressPercent: row.progressPercent,
    completed: row.completed,
    lastViewedAt: row.lastViewedAt,
  };
}
