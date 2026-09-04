import { db } from "../db";
import type { Prisma } from "@prisma/client";

const PUBLISHED = "PUBLISHED" as const;

// ---------------------------------------------------------------- catalog

export interface LevelStats {
  id: string;
  name: string;
  label: string;
  slug: string;
  description: string;
  levelNumber: number;
  courseCount: number;
  topicCount: number;
  lessonCount: number;
}

export async function getLevelsWithStats(): Promise<LevelStats[]> {
  // One joined query (published courses → topics → lessons, ids only), reduced in JS.
  const levels = await db.level.findMany({
    where: { published: PUBLISHED },
    orderBy: { levelNumber: "asc" },
    include: {
      courses: {
        where: { published: PUBLISHED },
        orderBy: { order: "asc" },
        select: {
          id: true,
          topics: {
            where: { published: PUBLISHED },
            select: {
              id: true,
              lessons: { where: { published: PUBLISHED }, select: { id: true } },
            },
          },
        },
      },
    },
  });

  return levels.map((l) => ({
    id: l.id,
    name: l.name,
    label: l.label,
    slug: l.slug,
    description: l.description,
    levelNumber: l.levelNumber,
    courseCount: l.courses.length,
    topicCount: l.courses.reduce((n, c) => n + c.topics.length, 0),
    lessonCount: l.courses.reduce((n, c) => n + c.topics.reduce((m, t) => m + t.lessons.length, 0), 0),
  }));
}

export async function getLevels() {
  const levels = await db.level.findMany({
    where: { published: PUBLISHED },
    orderBy: { levelNumber: "asc" },
    include: { _count: { select: { courses: { where: { published: PUBLISHED } } } } },
  });
  return levels;
}

export async function getLevelBySlug(slug: string) {
  return db.level.findFirst({
    where: { slug, published: PUBLISHED },
    include: {
      courses: {
        where: { published: PUBLISHED },
        orderBy: { order: "asc" },
        include: {
          topics: {
            where: { published: PUBLISHED },
            orderBy: { order: "asc" },
            include: {
              lessons: {
                where: { published: PUBLISHED },
                orderBy: { order: "asc" },
                select: { id: true, title: true, slug: true },
              },
            },
          },
        },
      },
    },
  });
}

export async function getLevelById(id: string) {
  return db.level.findUnique({ where: { id } });
}

export async function getCourses(filter?: {
  levelSlug?: string;
  levelId?: string;
  q?: string;
}) {
  const where: Prisma.CourseWhereInput = { published: PUBLISHED };
  if (filter?.levelSlug) where.level = { slug: filter.levelSlug };
  if (filter?.levelId) where.levelId = filter.levelId;
  if (filter?.q) {
    where.OR = [
      { title: { contains: filter.q, mode: "insensitive" } },
      { description: { contains: filter.q, mode: "insensitive" } },
    ];
  }
  return db.course.findMany({
    where,
    orderBy: [{ level: { levelNumber: "asc" } }, { order: "asc" }],
    include: {
      level: { select: { id: true, name: true, label: true, levelNumber: true, slug: true } },
      _count: { select: { topics: { where: { published: PUBLISHED } } } },
    },
  });
}

export async function getCourseBySlug(slug: string) {
  return db.course.findFirst({
    where: { slug, published: PUBLISHED },
    include: {
      level: true,
      topics: {
        where: { published: PUBLISHED },
        orderBy: { order: "asc" },
        include: {
          lessons: {
            where: { published: PUBLISHED },
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              slug: true,
              order: true,
              durationMinutes: true,
            },
          },
          _count: { select: { lessons: { where: { published: PUBLISHED } } } },
        },
      },
    },
  });
}

export async function getCourseById(id: string) {
  return db.course.findUnique({ where: { id } });
}

// ---------------------------------------------------------------- lesson content

export async function getLessonContent(courseSlug: string, lessonSlug: string) {
  return db.lesson.findFirst({
    where: {
      slug: lessonSlug,
      published: PUBLISHED,
      topic: { published: PUBLISHED, course: { slug: courseSlug, published: PUBLISHED } },
    },
    include: {
      topic: {
        include: {
          course: {
            include: {
              level: true,
              topics: {
                where: { published: PUBLISHED },
                orderBy: { order: "asc" },
                include: {
                  lessons: {
                    where: { published: PUBLISHED },
                    orderBy: { order: "asc" },
                    select: { id: true, title: true, slug: true, order: true },
                  },
                },
              },
            },
          },
        },
      },
      vocabulary: { orderBy: { word: "asc" } },
      quiz: { where: { published: PUBLISHED }, include: { _count: { select: { questions: true } } } },
      listening: { where: { published: PUBLISHED }, include: { _count: { select: { questions: true } } } },
      reading: { where: { published: PUBLISHED }, orderBy: { order: "asc" } },
      exercises: { where: { published: PUBLISHED }, orderBy: { order: "asc" } },
    },
  });
}

export async function getLessonById(lessonId: string) {
  return db.lesson.findUnique({
    where: { id: lessonId },
    include: {
      topic: { include: { course: { include: { level: true } } } },
      quiz: { where: { published: PUBLISHED } },
      listening: { where: { published: PUBLISHED } },
    },
  });
}

export async function getTopicGrammar(topicId: string) {
  return db.grammar.findMany({ where: { topicId }, orderBy: { title: "asc" } });
}

export async function getVocabularyOfLesson(lessonId: string) {
  return db.vocabulary.findMany({
    where: { lessonId },
    orderBy: { word: "asc" },
  });
}

// ---------------------------------------------------------------- search

export async function searchContent(q: string, limit = 8) {
  if (!q.trim()) return { courses: [], topics: [], lessons: [], vocabulary: [], grammar: [] };
  const query = q.trim();

  const [courses, topics, lessons, vocabulary, grammar] = await Promise.all([
    db.course.findMany({
      where: { published: PUBLISHED, OR: [{ title: { contains: query, mode: "insensitive" } }, { description: { contains: query, mode: "insensitive" } }] },
      take: limit,
      select: { id: true, title: true, slug: true, shortDescription: true, level: { select: { name: true, levelNumber: true } } },
    }),
    db.topic.findMany({
      where: { published: PUBLISHED, OR: [{ title: { contains: query, mode: "insensitive" } }, { description: { contains: query, mode: "insensitive" } }] },
      take: limit,
      select: { id: true, title: true, slug: true, course: { select: { title: true, slug: true, level: { select: { levelNumber: true } } } } },
    }),
    db.lesson.findMany({
      where: { published: PUBLISHED, OR: [{ title: { contains: query, mode: "insensitive" } }, { content: { contains: query, mode: "insensitive" } }] },
      take: limit,
      select: { id: true, title: true, slug: true, summary: true, topic: { select: { slug: true, course: { select: { slug: true, title: true } } } } },
    }),
    db.vocabulary.findMany({
      where: { OR: [{ word: { contains: query, mode: "insensitive" } }, { meaning: { contains: query, mode: "insensitive" } }, { thaiMeaning: { contains: query } }] },
      take: limit,
      select: { id: true, word: true, partOfSpeech: true, thaiMeaning: true, meaning: true, lesson: { select: { slug: true, topic: { select: { slug: true, course: { select: { slug: true } } } } } } },
    }),
    db.grammar.findMany({
      where: { OR: [{ title: { contains: query, mode: "insensitive" } }, { explanation: { contains: query, mode: "insensitive" } }] },
      take: limit,
      select: {
        id: true,
        title: true,
        explanation: true,
        topic: {
          select: {
            slug: true,
            course: { select: { slug: true } },
            lessons: {
              where: { published: "PUBLISHED" },
              orderBy: { order: "asc" },
              take: 1,
              select: { slug: true },
            },
          },
        },
      },
    }),
  ]);

  return { courses, topics, lessons, vocabulary, grammar };
}
