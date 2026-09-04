import { db } from "../db";
import type { Prisma, ContentStatus, Role } from "@prisma/client";
import { subDays, startOfDay } from "date-fns";
import { slugify } from "../utils";

// ---------------------------------------------------------------- analytics

export async function getAdminStats() {
  const [
    totalUsers,
    activeUsers,
    totalLevels,
    totalCourses,
    totalTopics,
    totalLessons,
    totalVocabulary,
    totalListening,
    totalQuizQuestions,
    quizAttempts,
    listeningAttempts,
    courseCompletions,
    recentUsers,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { isActive: true } }),
    db.level.count(),
    db.course.count(),
    db.topic.count(),
    db.lesson.count(),
    db.vocabulary.count(),
    db.listeningExercise.count(),
    db.quizQuestion.count(),
    db.quizAttempt.findMany({
      select: { percentage: true, passed: true },
      take: 5000,
    }),
    db.listeningAttempt.findMany({
      select: { percentage: true, passed: true },
      take: 5000,
    }),
    db.courseProgress.count({ where: { completed: true } }),
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true },
    }),
  ]);

  const average = (rows: { percentage: number }[]) =>
    rows.length === 0
      ? 0
      : Math.round(rows.reduce((s, r) => s + r.percentage, 0) / rows.length);

  const active7 = await db.learningActivity.count({
    where: { activityDate: { gte: subDays(new Date(), 7) } },
  });

  // Daily activity for the last 7 days
  const activity = await db.learningActivity.groupBy({
    by: ["activityDate"],
    where: { activityDate: { gte: startOfDay(subDays(new Date(), 6)) } },
    _count: { _all: true },
  });
  const activityMap = new Map(
    activity.map((a) => [startOfDay(a.activityDate).getTime(), a._count._all])
  );
  const dailyActivity = Array.from({ length: 7 }, (_, i) => {
    const day = startOfDay(subDays(new Date(), 6 - i));
    return {
      label: day.toLocaleDateString("en-GB", { weekday: "short" }),
      count: activityMap.get(day.getTime()) ?? 0,
    };
  });

  return {
    totalUsers,
    activeUsers,
    totalLevels,
    totalCourses,
    totalTopics,
    totalLessons,
    totalVocabulary,
    totalListening,
    totalQuizQuestions,
    quizAverage: average(quizAttempts),
    listeningAverage: average(listeningAttempts),
    courseCompletionPercent:
      totalUsers === 0 ? 0 : Math.round((courseCompletions / (totalUsers * Math.max(totalCourses, 1))) * 100),
    activeUsersLast7Days: active7,
    dailyActivity,
    recentUsers,
  };
}

// ---------------------------------------------------------------- user management

export async function listUsers(opts: {
  q?: string;
  role?: string;
  active?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.min(100, Math.max(5, opts.pageSize ?? 20));
  const where: Prisma.UserWhereInput = {};
  if (opts.q) {
    where.OR = [
      { firstName: { contains: opts.q, mode: "insensitive" } },
      { lastName: { contains: opts.q, mode: "insensitive" } },
      { email: { contains: opts.q, mode: "insensitive" } },
      { username: { contains: opts.q, mode: "insensitive" } },
    ];
  }
  if (opts.role === "STUDENT" || opts.role === "ADMIN") where.role = opts.role;
  if (opts.active === "true") where.isActive = true;
  if (opts.active === "false") where.isActive = false;

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        xp: true,
        bypassLevelLock: true,
        createdAt: true,
        lastLoginAt: true,
        _count: { select: { lessonProgress: { where: { completed: true } } } },
      },
    }),
    db.user.count({ where }),
  ]);

  return { users, total, page, pageSize };
}

export async function updateUserStatus(id: string, data: {
  isActive?: boolean;
  role?: Role;
  bypassLevelLock?: boolean;
  currentLevelId?: string | null;
}) {
  return db.user.update({ where: { id }, data });
}

export async function resetUserProgress(userId: string) {
  await db.$transaction([
    db.lessonProgress.deleteMany({ where: { userId } }),
    db.topicProgress.deleteMany({ where: { userId } }),
    db.courseProgress.deleteMany({ where: { userId } }),
    db.levelProgress.deleteMany({ where: { userId } }),
    db.certificate.deleteMany({ where: { userId } }),
    db.userAchievement.deleteMany({ where: { userId } }),
    db.bookmark.deleteMany({ where: { userId } }),
    db.note.deleteMany({ where: { userId } }),
    db.user.update({
      where: { id: userId },
      data: { xp: 0, currentLevelId: null },
    }),
  ]);
}

// ---------------------------------------------------------------- content CRUD

type StatusInput = ContentStatus;

const STATUSES: ContentStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export async function adminListLevels() {
  return db.level.findMany({ orderBy: { levelNumber: "asc" } });
}

export async function adminCreateLevel(data: {
  name: string; label: string; description: string; levelNumber: number; published: StatusInput;
  slug?: string;
}) {
  return db.level.create({
    data: {
      name: data.name,
      label: data.label,
      slug: data.slug || slugify(data.name),
      description: data.description,
      levelNumber: data.levelNumber,
      published: data.published,
    },
  });
}

export async function adminUpdateLevel(id: string, data: Parameters<typeof adminCreateLevel>[0]) {
  return db.level.update({
    where: { id },
    data: {
      name: data.name,
      label: data.label,
      slug: data.slug || slugify(data.name),
      description: data.description,
      levelNumber: data.levelNumber,
      published: data.published,
    },
  });
}

export async function adminDeleteLevel(id: string) {
  // Cascade removes courses → topics → lessons → dependent content.
  return db.level.delete({ where: { id } });
}

export async function adminReorderLevel(id: string, direction: "up" | "down") {
  const level = await db.level.findUnique({ where: { id } });
  if (!level) return null;
  const neighbor = await db.level.findFirst({
    where: { levelNumber: direction === "up" ? { lt: level.levelNumber } : { gt: level.levelNumber } },
    orderBy: { levelNumber: direction === "up" ? "desc" : "asc" },
    select: { id: true, levelNumber: true },
  });
  if (!neighbor) return level;
  await db.$transaction([
    db.level.update({ where: { id: level.id }, data: { levelNumber: neighbor.levelNumber } }),
    db.level.update({ where: { id: neighbor.id }, data: { levelNumber: level.levelNumber } }),
  ]);
  return db.level.findUnique({ where: { id } });
}

/** Course reorder within a level */
export async function adminReorderInLevel(
  model: "course" | "topic",
  id: string,
  direction: "up" | "down",
  parentWhere: { levelId?: string; courseId?: string }
) {
  const orderKey = "order";
  const row = (await (model === "course"
    ? db.course.findUnique({ where: { id }, select: { id: true, order: true, levelId: true } })
    : db.topic.findUnique({ where: { id }, select: { id: true, order: true, courseId: true } }))) as {
    id: string;
    order: number;
    levelId?: string;
    courseId?: string;
  } | null;
  if (!row) return null;
  const parentValue = model === "course" ? (row.levelId as string) : (row.courseId as string);
  void parentWhere;

  const neighbor = await (model === "course"
    ? db.course.findFirst({
        where: { levelId: parentValue, order: direction === "up" ? { lt: row.order } : { gt: row.order } },
        orderBy: { order: direction === "up" ? "desc" : "asc" },
        select: { id: true, order: true },
      })
    : db.topic.findFirst({
        where: { courseId: parentValue as string, order: direction === "up" ? { lt: row.order } : { gt: row.order } },
        orderBy: { order: direction === "up" ? "desc" : "asc" },
        select: { id: true, order: true },
      }));
  if (!neighbor) return row;
  void orderKey;

  await db.$transaction([
    model === "course"
      ? db.course.update({ where: { id: row.id }, data: { order: neighbor.order } })
      : db.topic.update({ where: { id: row.id }, data: { order: neighbor.order } }),
    model === "course"
      ? db.course.update({ where: { id: neighbor.id }, data: { order: row.order } })
      : db.topic.update({ where: { id: neighbor.id }, data: { order: row.order } }),
  ]);
  return row;
}

// Generic-ish CRUD below — each function maps to its Prisma model.

export async function adminCreateCourse(data: {
  levelId: string; title: string; shortDescription: string; description: string;
  order: number; published: StatusInput; slug?: string; thumbnail?: string | null;
}) {
  return db.course.create({
    data: {
      levelId: data.levelId,
      title: data.title,
      slug: data.slug || slugify(data.title),
      shortDescription: data.shortDescription,
      description: data.description,
      order: data.order,
      published: data.published,
      thumbnail: data.thumbnail ?? null,
    },
  });
}

export async function adminUpdateCourse(id: string, data: Parameters<typeof adminCreateCourse>[0]) {
  return db.course.update({
    where: { id },
    data: {
      levelId: data.levelId,
      title: data.title,
      slug: data.slug || slugify(data.title),
      shortDescription: data.shortDescription,
      description: data.description,
      order: data.order,
      published: data.published,
      thumbnail: data.thumbnail ?? null,
    },
  });
}

export async function adminDeleteCourse(id: string) {
  return db.course.delete({ where: { id } });
}

export async function adminCreateTopic(data: {
  courseId: string; title: string; description: string; order: number;
  difficulty: string; published: StatusInput; slug?: string;
}) {
  return db.topic.create({
    data: {
      courseId: data.courseId,
      title: data.title,
      slug: data.slug || slugify(data.title),
      description: data.description,
      order: data.order,
      difficulty: data.difficulty as Prisma.TopicCreateInput["difficulty"],
      published: data.published,
    },
  });
}

export async function adminUpdateTopic(id: string, data: Parameters<typeof adminCreateTopic>[0]) {
  return db.topic.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug || slugify(data.title),
      description: data.description,
      order: data.order,
      difficulty: data.difficulty as Prisma.TopicUpdateInput["difficulty"],
      published: data.published,
    },
  });
}

export async function adminDeleteTopic(id: string) {
  return db.topic.delete({ where: { id } });
}

export async function adminCreateLesson(data: {
  topicId: string; title: string; content: string; objectives: string[];
  order: number; durationMinutes: number; published: StatusInput; slug?: string; summary?: string | null;
}) {
  return db.lesson.create({
    data: {
      topicId: data.topicId,
      title: data.title,
      slug: data.slug || slugify(data.title),
      content: data.content,
      objectives: data.objectives,
      order: data.order,
      durationMinutes: data.durationMinutes,
      published: data.published,
      summary: data.summary ?? null,
    },
  });
}

export async function adminUpdateLesson(id: string, data: Parameters<typeof adminCreateLesson>[0]) {
  return db.lesson.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug || slugify(data.title),
      content: data.content,
      objectives: data.objectives,
      order: data.order,
      durationMinutes: data.durationMinutes,
      published: data.published,
      summary: data.summary ?? null,
    },
  });
}

export async function adminDeleteLesson(id: string) {
  return db.lesson.delete({ where: { id } });
}

export async function adminCreateVocabulary(data: {
  lessonId: string; word: string; pronunciation?: string | null; partOfSpeech: string;
  thaiMeaning?: string | null; meaning: string; example: string; businessExample: string;
  audioUrl?: string | null;
}) {
  return db.vocabulary.create({ data: { ...data } });
}

export async function adminUpdateVocabulary(id: string, data: Parameters<typeof adminCreateVocabulary>[0]) {
  return db.vocabulary.update({ where: { id }, data });
}

export async function adminDeleteVocabulary(id: string) {
  return db.vocabulary.delete({ where: { id } });
}

export async function adminCreateGrammar(data: {
  topicId: string; title: string; explanation: string; structure: string;
  examples: string[]; businessExamples: string[]; commonMistakes: string[];
}) {
  return db.grammar.create({
    data: {
      topicId: data.topicId,
      title: data.title,
      explanation: data.explanation,
      structure: data.structure,
      examples: data.examples,
      businessExamples: data.businessExamples,
      commonMistakes: data.commonMistakes,
    },
  });
}

export async function adminUpdateGrammar(id: string, data: Parameters<typeof adminCreateGrammar>[0]) {
  return db.grammar.update({ where: { id }, data });
}

export async function adminDeleteGrammar(id: string) {
  return db.grammar.delete({ where: { id } });
}

export async function adminCreateListening(data: {
  lessonId: string; title: string; transcript: string; audioUrl?: string | null;
  duration: number; published: StatusInput;
}) {
  return db.listeningExercise.create({
    data: {
      lessonId: data.lessonId,
      title: data.title,
      transcript: data.transcript,
      audioUrl: data.audioUrl ?? null,
      duration: data.duration,
      published: data.published,
    },
  });
}

export async function adminUpdateListening(id: string, data: Parameters<typeof adminCreateListening>[0]) {
  return db.listeningExercise.update({
    where: { id },
    data: {
      title: data.title,
      transcript: data.transcript,
      audioUrl: data.audioUrl ?? null,
      duration: data.duration,
      published: data.published,
    },
  });
}

export async function adminDeleteListening(id: string) {
  return db.listeningExercise.delete({ where: { id } });
}

export async function adminCreateQuiz(data: {
  lessonId: string; title: string; description?: string | null;
  passingScore: number; published: StatusInput;
}) {
  return db.quiz.create({
    data: {
      lessonId: data.lessonId,
      title: data.title,
      description: data.description ?? null,
      passingScore: data.passingScore,
      published: data.published,
    },
  });
}

export async function adminUpdateQuiz(id: string, data: Parameters<typeof adminCreateQuiz>[0]) {
  return db.quiz.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description ?? null,
      passingScore: data.passingScore,
      published: data.published,
    },
  });
}

export async function adminDeleteQuiz(id: string) {
  return db.quiz.delete({ where: { id } });
}

/** Replace a quiz's question set atomically. Attempt history survives (answers → NULL). */
export async function adminReplaceQuizQuestions(
  quizId: string,
  questions: {
    question: string;
    type: string;
    order: number;
    points: number;
    explanation?: string | null;
    options: { text: string; isCorrect: boolean; order: number }[];
  }[]
) {
  await db.$transaction(async (tx) => {
    await tx.quizQuestion.deleteMany({ where: { quizId } });
    for (const q of questions) {
      await tx.quizQuestion.create({
        data: {
          quizId,
          question: q.question,
          type: q.type as Prisma.QuizQuestionCreateInput["type"],
          order: q.order,
          points: q.points,
          explanation: q.explanation ?? null,
          options: { create: q.options },
        },
      });
    }
  });
}

/** Replace a listening exercise's question set atomically. */
export async function adminReplaceListeningQuestions(
  exerciseId: string,
  questions: {
    question: string;
    type: string;
    options: string[];
    answer: string;
    explanation?: string | null;
    order: number;
    points: number;
  }[]
) {
  await db.$transaction(async (tx) => {
    await tx.listeningQuestion.deleteMany({ where: { listeningExerciseId: exerciseId } });
    for (const q of questions) {
      await tx.listeningQuestion.create({
        data: {
          listeningExerciseId: exerciseId,
          question: q.question,
          type: q.type as Prisma.ListeningQuestionCreateInput["type"],
          options: q.options,
          answer: q.answer,
          explanation: q.explanation ?? null,
          order: q.order,
          points: q.points,
        },
      });
    }
  });
}

export async function adminListAllCourses() {
  return db.course.findMany({
    orderBy: [{ level: { levelNumber: "asc" } }, { order: "asc" }],
    include: {
      level: { select: { name: true, levelNumber: true } },
      _count: { select: { topics: true } },
    },
  });
}

export async function adminListAllTopics() {
  return db.topic.findMany({
    orderBy: [{ course: { level: { levelNumber: "asc" } }, order: "asc" }],
    include: {
      course: {
        select: { title: true, level: { select: { levelNumber: true } } },
      },
      _count: { select: { lessons: true } },
    },
  });
}

export async function adminListAllLessons() {
  return db.lesson.findMany({
    orderBy: [{ topic: { course: { level: { levelNumber: "asc" } } }, order: "asc" }],
    include: {
      topic: {
        select: {
          title: true,
          course: { select: { title: true, slug: true, level: { select: { levelNumber: true } } } },
        },
      },
    },
    take: 1000,
  });
}

export async function adminGetLessonDetail(lessonId: string) {
  return db.lesson.findUnique({
    where: { id: lessonId },
    include: {
      topic: {
        include: { course: { include: { level: true } } },
      },
      vocabulary: { orderBy: { word: "asc" } },
      listening: { include: { questions: { orderBy: { order: "asc" } } } },
      quiz: { include: { questions: { orderBy: { order: "asc" }, include: { options: { orderBy: { order: "asc" } } } } } },
      reading: { orderBy: { order: "asc" } },
      exercises: { orderBy: { order: "asc" } },
    },
  });
}

export async function adminListAllVocabulary() {
  return db.vocabulary.findMany({
    orderBy: { word: "asc" },
    include: {
      lesson: {
        select: {
          title: true,
          topic: { select: { course: { select: { title: true, level: { select: { levelNumber: true } } } } } },
        },
      },
    },
    take: 500,
  });
}

export async function adminListAllGrammar() {
  return db.grammar.findMany({
    orderBy: { title: "asc" },
    include: {
      topic: {
        select: {
          title: true,
          course: { select: { title: true, level: { select: { levelNumber: true } } } },
        },
      },
    },
    take: 500,
  });
}

export async function adminListAllListening() {
  return db.listeningExercise.findMany({
    orderBy: { title: "asc" },
    include: {
      lesson: {
        select: {
          title: true,
          topic: { select: { course: { select: { title: true, level: { select: { levelNumber: true } } } } } },
        },
      },
      _count: { select: { questions: true, attempts: true } },
    },
    take: 500,
  });
}

export async function adminListAllQuizzes() {
  return db.quiz.findMany({
    orderBy: { title: "asc" },
    include: {
      lesson: {
        select: {
          title: true,
          topic: { select: { course: { select: { title: true, level: { select: { levelNumber: true } } } } } },
        },
      },
      _count: { select: { questions: true, attempts: true } },
    },
    take: 500,
  });
}

export async function adminListAllReading() {
  return db.readingExercise.findMany({
    orderBy: { title: "asc" },
    include: {
      lesson: {
        select: {
          title: true,
          topic: { select: { course: { select: { title: true, level: { select: { levelNumber: true } } } } } },
        },
      },
    },
    take: 300,
  });
}

export async function adminCreateReading(data: {
  lessonId: string; title: string; passage: string; order: number; published: StatusInput;
}) {
  return db.readingExercise.create({
    data: {
      lessonId: data.lessonId,
      title: data.title,
      passage: data.passage,
      questions: [],
      order: data.order,
      published: data.published,
    },
  });
}

export async function adminUpdateReading(id: string, data: Parameters<typeof adminCreateReading>[0]) {
  return db.readingExercise.update({
    where: { id },
    data: {
      title: data.title,
      passage: data.passage,
      order: data.order,
      published: data.published,
    },
  });
}

export async function adminDeleteReading(id: string) {
  return db.readingExercise.delete({ where: { id } });
}

export async function adminReplaceReadingQuestions(
  readingId: string,
  questions: { question: string; options: string[]; answer: string; explanation?: string | null }[]
) {
  return db.readingExercise.update({
    where: { id: readingId },
    data: { questions: questions as Prisma.InputJsonValue },
  });
}

export async function adminListAllExercises() {
  return db.exercise.findMany({
    orderBy: { title: "asc" },
    include: {
      lesson: {
        select: {
          title: true,
          topic: { select: { course: { select: { title: true, level: { select: { levelNumber: true } } } } } },
        },
      },
    },
    take: 300,
  });
}

export async function adminCreateExercise(data: {
  lessonId: string; kind: string; title: string; prompt: string;
  content: unknown; order: number; published: StatusInput;
}) {
  return db.exercise.create({
    data: {
      lessonId: data.lessonId,
      kind: data.kind,
      title: data.title,
      prompt: data.prompt,
      content: data.content as Prisma.InputJsonValue,
      order: data.order,
      published: data.published,
    },
  });
}

export async function adminUpdateExercise(id: string, data: Parameters<typeof adminCreateExercise>[0]) {
  return db.exercise.update({
    where: { id },
    data: {
      title: data.title,
      prompt: data.prompt,
      content: data.content as Prisma.InputJsonValue,
      order: data.order,
      published: data.published,
    },
  });
}

export async function adminDeleteExercise(id: string) {
  return db.exercise.delete({ where: { id } });
}

// Shared status/order helpers used by admin tables
export { STATUSES };
