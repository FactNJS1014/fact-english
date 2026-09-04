import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ChevronRight, Clock, Layers, PlayCircle } from "lucide-react";
import { getCourseBySlug } from "@/lib/services/content.service";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  return { title: course ? course.title : "Course" };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [course, user] = await Promise.all([getCourseBySlug(slug), getSessionUser()]);
  if (!course) notFound();

  // Per-user lesson completion for this course
  const lessonIds = course.topics.flatMap((t) => t.lessons.map((l) => l.id));
  const completedRows = user
    ? await db.lessonProgress.findMany({
        where: { userId: user.id, lessonId: { in: lessonIds }, completed: true },
        select: { lessonId: true },
      })
    : [];
  const completed = new Set(completedRows.map((r) => r.lessonId));

  const lessonCount = lessonIds.length;
  const doneCount = completed.size;
  const percent = lessonCount ? Math.round((doneCount / lessonCount) * 100) : 0;

  const firstTopic = course.topics[0];
  const firstLesson = firstTopic?.lessons[0];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-faint">
        <Link href="/courses" className="hover:text-brand">Courses</Link>
        <span className="mx-2">/</span>
        <Link href={`/levels/${course.level.slug}`} className="hover:text-brand">
          Level {course.level.levelNumber}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-muted">{course.title}</span>
      </nav>

      <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-surface-2 via-surface to-surface-2 p-7 sm:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(circle at 80% 15%, rgba(34,211,238,0.15), transparent 45%), radial-gradient(circle at 10% 100%, rgba(59,130,246,0.2), transparent 45%)",
          }}
        />
        <div className="relative flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge tone="brand">Level {course.level.levelNumber} · {course.level.label}</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {course.title}
            </h1>
            <p className="mt-3 leading-relaxed text-muted">{course.description}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-xs text-faint">
              <span className="inline-flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-brand" /> {course.topics.length} topics
              </span>
              <span className="inline-flex items-center gap-1.5">
                <PlayCircle className="h-4 w-4 text-brand" /> {lessonCount} lessons
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-brand" />{" "}
                {course.topics.reduce((n, t) => n + t.lessons.reduce((m, l) => m + l.durationMinutes, 0), 0)}{" "}
                min total
              </span>
            </div>
          </div>

          {firstTopic && firstLesson ? (
            <div className="w-full max-w-xs rounded-2xl border border-line bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-faint">
                {user ? `Progress · ${percent}%` : "Ready when you are"}
              </p>
              {user ? (
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-3">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand to-accent-cyan transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              ) : null}
              <Link
                href={
                  user
                    ? `/learn/${course.slug}/${firstLesson.slug}`
                    : `/login?redirect=${encodeURIComponent(`/learn/${course.slug}/${firstLesson.slug}`)}`
                }
                className="btn btn-primary mt-4 w-full"
              >
                Start Learning
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      <h2 className="mb-4 mt-12 text-2xl font-extrabold tracking-tight">Course topics</h2>
      <ol className="flex flex-col gap-3">
        {course.topics.map((topic, topicIndex) => (
          <li key={topic.id} className="card overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 px-5 py-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft font-bold text-brand">
                {topicIndex + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold">{topic.title}</h3>
                <p className="mt-0.5 line-clamp-1 text-sm text-muted">{topic.description}</p>
              </div>
              <span className="text-xs text-faint">
                {topic.lessons.length} lesson{topic.lessons.length === 1 ? "" : "s"}
              </span>
              {topic.lessons[0] ? (
                <Link
                  href={
                    user
                      ? `/learn/${course.slug}/${topic.lessons[0].slug}`
                      : `/login?redirect=${encodeURIComponent(`/learn/${course.slug}/${topic.lessons[0].slug}`)}`
                  }
                  className="btn btn-outline btn-sm"
                >
                  {user && completed.has(topic.lessons[0].id) ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : null}
                  Open lesson <ChevronRight className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
