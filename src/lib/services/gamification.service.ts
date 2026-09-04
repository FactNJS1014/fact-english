import { db } from "../db";
import type { Prisma } from "@prisma/client";
import { ACHIEVEMENTS } from "../constants";
import { startOfDay } from "date-fns";

type Tx = Prisma.TransactionClient;

const DAY_MS = 24 * 60 * 60 * 1000;

// ---------------------------------------------------------------- activity

export async function recordActivityTx(
  tx: Tx,
  userId: string,
  kind: string,
  detail?: string
) {
  await tx.learningActivity.create({
    data: { userId, kind, detail },
  });
}

export async function addXpTx(tx: Tx, userId: string, amount: number) {
  if (amount <= 0) return;
  await tx.user.update({
    where: { id: userId },
    data: { xp: { increment: amount } },
  });
}

// ---------------------------------------------------------------- streaks

export async function getUserStreaks(userId: string) {
  const rows = await db.learningActivity.findMany({
    where: { userId },
    select: { activityDate: true },
    orderBy: { activityDate: "desc" },
    take: 400,
  });

  const days = new Set<number>();
  for (const row of rows) days.add(startOfDay(row.activityDate).getTime());
  const sorted = [...days].sort((a, b) => a - b);

  const today = startOfDay(new Date()).getTime();
  const yesterday = today - DAY_MS;

  let currentStreak = 0;
  let cursor = days.has(today) ? today : days.has(yesterday) ? yesterday : -1;
  while (cursor !== -1 && days.has(cursor)) {
    currentStreak += 1;
    cursor -= DAY_MS;
  }

  let longestStreak = 0;
  let run = 0;
  let prev: number | null = null;
  for (const day of sorted) {
    run = prev !== null && day - prev === DAY_MS ? run + 1 : 1;
    if (run > longestStreak) longestStreak = run;
    prev = day;
  }

  return {
    currentStreak,
    longestStreak,
    lastActivityAt: rows[0]?.activityDate ?? null,
  };
}

// ---------------------------------------------------------------- achievements

interface AchievementCondition {
  code: string;
  check: (tx: Tx, userId: string) => Promise<boolean>;
}

export async function awardAchievementsTx(tx: Tx, userId: string) {
  const [all, owned] = await Promise.all([
    tx.achievement.findMany({ select: { id: true, code: true, xp: true } }),
    tx.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true },
    }),
  ]);
  const ownedCodes = new Set(
    owned.map((o) => all.find((a) => a.id === o.achievementId)?.code).filter(Boolean)
  );

  const conditions: AchievementCondition[] = [
    {
      code: ACHIEVEMENTS.FIRST_LESSON,
      check: async (t, u) =>
        (await t.lessonProgress.count({ where: { userId: u, completed: true } })) >= 1,
    },
    {
      code: ACHIEVEMENTS.LESSONS_10,
      check: async (t, u) =>
        (await t.lessonProgress.count({ where: { userId: u, completed: true } })) >= 10,
    },
    {
      code: ACHIEVEMENTS.LESSONS_50,
      check: async (t, u) =>
        (await t.lessonProgress.count({ where: { userId: u, completed: true } })) >= 50,
    },
    {
      code: ACHIEVEMENTS.LESSONS_100,
      check: async (t, u) =>
        (await t.lessonProgress.count({ where: { userId: u, completed: true } })) >= 100,
    },
    {
      code: ACHIEVEMENTS.FIRST_QUIZ,
      check: async (t, u) => (await t.quizAttempt.count({ where: { userId: u } })) >= 1,
    },
    {
      code: ACHIEVEMENTS.PERFECT_QUIZ,
      check: async (t, u) =>
        Boolean(
          await t.quizAttempt.findFirst({ where: { userId: u, percentage: 100 } })
        ),
    },
    {
      code: ACHIEVEMENTS.FIRST_LISTENING,
      check: async (t, u) =>
        (await t.listeningAttempt.count({ where: { userId: u } })) >= 1,
    },
    {
      code: ACHIEVEMENTS.FIRST_READING,
      check: async (t, u) =>
        (await t.readingAttempt.count({ where: { userId: u } })) >= 1,
    },
    {
      code: ACHIEVEMENTS.FIRST_COURSE,
      check: async (t, u) =>
        (await t.courseProgress.count({ where: { userId: u, completed: true } })) >= 1,
    },
    {
      code: ACHIEVEMENTS.FIRST_WRITING,
      check: async (t, u) =>
        (await t.writingSubmission.count({ where: { userId: u } })) >= 1,
    },
    {
      code: ACHIEVEMENTS.STREAK_7,
      check: async (t, u) => (await streakInTx(t, u)) >= 7,
    },
    {
      code: ACHIEVEMENTS.STREAK_30,
      check: async (t, u) => (await streakInTx(t, u)) >= 30,
    },
  ];

  for (let n = 1; n <= 5; n++) {
    const code = ACHIEVEMENTS[`LEVEL_${n}` as keyof typeof ACHIEVEMENTS];
    conditions.push({
      code,
      check: async (t, u) =>
        Boolean(
          await t.certificate.findFirst({
            where: { userId: u, level: { levelNumber: n } },
          })
        ),
    });
  }

  const toAward: { id: string; xp: number }[] = [];
  for (const achievement of all) {
    if (ownedCodes.has(achievement.code)) continue;
    const condition = conditions.find((c) => c.code === achievement.code);
    const earned = condition ? await condition.check(tx, userId) : false;
    if (earned) toAward.push({ id: achievement.id, xp: achievement.xp });
  }

  for (const item of toAward) {
    await tx.userAchievement.create({
      data: { userId, achievementId: item.id },
    });
    await addXpTx(tx, userId, item.xp);
  }

  return toAward.length;
}

async function streakInTx(tx: Tx, userId: string): Promise<number> {
  const rows = await tx.learningActivity.findMany({
    where: { userId },
    select: { activityDate: true },
    orderBy: { activityDate: "desc" },
    take: 400,
  });
  const days = new Set<number>();
  for (const row of rows) days.add(startOfDay(row.activityDate).getTime());
  const today = startOfDay(new Date()).getTime();
  const yesterday = today - DAY_MS;
  let cursor = days.has(today) ? today : days.has(yesterday) ? yesterday : -1;
  let count = 0;
  while (cursor !== -1 && days.has(cursor)) {
    count += 1;
    cursor -= DAY_MS;
  }
  return count;
}

export async function getUserAchievements(userId: string) {
  return db.userAchievement.findMany({
    where: { userId },
    include: { achievement: true },
    orderBy: { awardedAt: "desc" },
  });
}
