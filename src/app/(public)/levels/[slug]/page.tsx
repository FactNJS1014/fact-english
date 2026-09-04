import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Lock, PlayCircle } from "lucide-react";
import { getLevelBySlug } from "@/lib/services/content.service";
import { getSessionUser } from "@/lib/auth";
import { getProgressSummary } from "@/lib/services/progress.service";
import { CourseCard } from "@/components/courses/course-card";
import { Badge } from "@/components/ui/badge";
import { Banner } from "@/components/ui/banner";
import { ProgressBar } from "@/components/ui/progress";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Level — ${slug.replace(/-/g, " ")}` };
}

export default async function LevelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [level, user] = await Promise.all([getLevelBySlug(slug), getSessionUser()]);
  if (!level) notFound();

  const summary = user ? await getProgressSummary(user.id) : null;
  const levelProgress = summary?.levels.find((l) => l.levelId === level.id);

  const firstCourse = level.courses[0];
  const firstLesson = firstCourse?.topics[0]?.lessons[0];

  const totalLessons = level.courses.reduce(
    (n, c) => n + c.topics.reduce((m, t) => m + t.lessons.length, 0),
    0
  );
  const totalTopics = level.courses.reduce((n, c) => n + c.topics.length, 0);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-faint">
        <Link href="/levels" className="hover:text-brand">
          Levels
        </Link>
        <span className="mx-2">/</span>
        <span className="capitalize text-muted">
          Level {level.levelNumber} · {level.name}
        </span>
      </nav>

      <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-surface-2 via-surface to-surface-2 p-7 sm:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(circle at 85% 20%, rgba(139,92,246,0.18), transparent 45%), radial-gradient(circle at 15% 90%, rgba(59,130,246,0.2), transparent 45%)",
          }}
        />
        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-accent-purple text-2xl font-black text-white shadow-xl shadow-brand/25">
                {level.levelNumber}
              </span>
              <div>
                <Badge tone="cyan">Level {level.levelNumber}</Badge>
                <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {level.label} Business English
                </h1>
              </div>
            </div>
            <p className="mt-5 leading-relaxed text-muted">{level.description}</p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-faint">
              <Badge>{level.courses.length} courses</Badge>
              <Badge>{totalTopics} topics</Badge>
              <Badge>{totalLessons} lessons</Badge>
            </div>
          </div>

          <div className="w-full max-w-xs rounded-2xl border border-line bg-surface p-5">
            {levelProgress ? (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-muted">Your progress</span>
                  <span className="font-extrabold text-ink">{levelProgress.percent}%</span>
                </div>
                <ProgressBar value={levelProgress.percent} className="mt-2" />
                {levelProgress.completed ? (
                  <p className="mt-3 text-xs font-semibold text-success">
                    ✓ Level completed — certificate earned
                  </p>
                ) : null}
              </>
            ) : (
              <p className="text-sm text-muted">
                Sign in to track your progress through this level.
              </p>
            )}
            <div className="mt-4 flex flex-col gap-2">
              {firstCourse && firstLesson ? (
                <Link
                  href={
                    user
                      ? `/learn/${firstCourse.slug}/${firstLesson.slug}`
                      : `/login?redirect=${encodeURIComponent(`/learn/${firstCourse.slug}/${firstLesson.slug}`)}`
                  }
                  className="btn btn-primary w-full"
                >
                  <PlayCircle className="h-4 w-4" /> Start Learning
                </Link>
              ) : null}
              <Link href="/courses" className="btn btn-outline w-full">
                Browse all courses <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {user && levelProgress && !levelProgress.unlocked ? (
        <div className="mt-6">
          <Banner tone="warning">
            <strong>Level {level.levelNumber} is locked.</strong> Complete Level{" "}
            {level.levelNumber - 1} first to unlock it.
          </Banner>
        </div>
      ) : null}

      <h2 className="mb-5 mt-12 text-2xl font-extrabold tracking-tight">
        Courses in this level
      </h2>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {level.courses.map((course) => (
          <CourseCard
            key={course.id}
            course={{
              id: course.id,
              title: course.title,
              slug: course.slug,
              shortDescription: course.shortDescription,
              topicCount: course.topics.length,
              lessonCount: course.topics.reduce((n, t) => n + t.lessons.length, 0),
              levelNumber: level.levelNumber,
            }}
          />
        ))}
      </div>

      {/* Topic map */}
      <h2 className="mb-5 mt-14 text-2xl font-extrabold tracking-tight">
        What you will learn
      </h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {level.courses.map((course) => (
          <details key={course.id} className="card overflow-hidden" open={course === firstCourse}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-faint">
                  Course {String(course.order + 1).padStart(2, "0")}
                </p>
                <h3 className="font-bold">{course.title}</h3>
              </div>
              <Lock className="hidden" aria-hidden />
              <span className="text-xs text-faint">{course.topics.length} topics</span>
            </summary>
            <div className="border-t border-line px-5 py-4">
              <ul className="grid gap-2 text-sm sm:grid-cols-2">
                {course.topics.map((topic) => (
                  <li key={topic.id} className="flex items-start gap-2 text-muted">
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                    <span>
                      {topic.title}
                      <span className="text-faint">
                        {" "}
                        · {topic.lessons.length} lesson
                        {topic.lessons.length === 1 ? "" : "s"}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
