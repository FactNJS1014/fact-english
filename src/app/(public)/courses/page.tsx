import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { CourseCard } from "@/components/courses/course-card";
import { SearchBox } from "@/components/ui/search-box";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty";

export const metadata: Metadata = { title: "All Courses" };

async function loadCatalog() {
  const [courses, levels, topics, lessons] = await Promise.all([
    db.course.findMany({
      where: { published: "PUBLISHED" },
      orderBy: [{ level: { levelNumber: "asc" } }, { order: "asc" }],
      include: {
        level: {
          select: { name: true, label: true, levelNumber: true, slug: true },
        },
      },
    }),
    db.level.findMany({
      where: { published: "PUBLISHED" },
      orderBy: { levelNumber: "asc" },
      select: { slug: true, label: true, levelNumber: true },
    }),
    db.topic.findMany({
      where: { published: "PUBLISHED" },
      select: { id: true, courseId: true },
    }),
    db.lesson.groupBy({
      by: ["topicId"],
      where: { published: "PUBLISHED" },
      _count: { _all: true },
    }),
  ]);

  const lessonByTopic = new Map(lessons.map((l) => [l.topicId, l._count._all]));
  const lessonByCourse = new Map<string, number>();
  const topicByCourse = new Map<string, number>();
  for (const topic of topics) {
    topicByCourse.set(
      topic.courseId,
      (topicByCourse.get(topic.courseId) ?? 0) + 1
    );
    lessonByCourse.set(
      topic.courseId,
      (lessonByCourse.get(topic.courseId) ?? 0) +
        (lessonByTopic.get(topic.id) ?? 0)
    );
  }
  return { courses, levels, topicByCourse, lessonByCourse };
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const { courses, levels, topicByCourse, lessonByCourse } = await loadCatalog();
  const levelFilter = sp.level;
  const query = (sp.q ?? "").trim().toLowerCase();

  const filtered = courses.filter((c) => {
    if (levelFilter && c.level.slug !== levelFilter) return false;
    if (query) {
      const hay = `${c.title} ${c.shortDescription} ${c.level.label} ${c.level.name}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            All Courses
          </h1>
          <p className="mt-2 max-w-xl text-muted">
            40+ Business English courses across 5 levels — from workplace basics
            to executive communication.
          </p>
        </div>
        <SearchBox
          initial={query}
          className="w-full sm:w-72"
          placeholder="Filter courses…"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/courses"
          className={cn(
            "chip !py-1.5 !px-3 text-xs hover:border-brand hover:text-brand",
            !levelFilter && "border-brand bg-brand-soft text-brand"
          )}
        >
          All levels
        </Link>
        {levels.map((l) => (
          <Link
            key={l.slug}
            href={`/courses?level=${l.slug}`}
            className={cn(
              "chip !py-1.5 !px-3 text-xs hover:border-brand hover:text-brand",
              levelFilter === l.slug && "border-brand bg-brand-soft text-brand"
            )}
          >
            Level {l.levelNumber} · {l.label}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No courses match your search"
            description="Try a different keyword or level."
            action={
              <Link href="/courses" className="btn btn-outline">
                Clear filters
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={{
                id: course.id,
                title: course.title,
                slug: course.slug,
                shortDescription: course.shortDescription,
                topicCount: topicByCourse.get(course.id) ?? 0,
                lessonCount: lessonByCourse.get(course.id) ?? 0,
                levelNumber: course.level.levelNumber,
                levelName: course.level.name,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
