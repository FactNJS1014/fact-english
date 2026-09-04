import type { Metadata } from "next";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { getLevelsWithStats } from "@/lib/services/content.service";
import { getSessionUser } from "@/lib/auth";
import { getProgressSummary } from "@/lib/services/progress.service";
import { LevelCard } from "@/components/courses/course-card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "English Levels" };

const cachedLevels = unstable_cache(
  async () => getLevelsWithStats(),
  ["levels-page"],
  { revalidate: 120 }
);

export default async function LevelsPage() {
  const [levels, user] = await Promise.all([cachedLevels(), getSessionUser()]);
  const summary = user ? await getProgressSummary(user.id) : null;
  const byLevel = new Map(
    (summary?.levels ?? []).map((l) => [l.levelId, l])
  );
  const hasMoreThanOne = levels.length > 1;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <Badge tone="brand">Learning Path</Badge>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          English Levels
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          From Basic to Advanced — 5 levels of Business English. Complete all
          the courses in a level to unlock the next one and earn a certificate.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {levels.map((level) => {
          const progress = byLevel.get(level.id);
          return (
            <LevelCard
              key={level.id}
              levelNumber={level.levelNumber}
              label={level.label}
              description={level.description}
              courseCount={level.courseCount}
              topicCount={level.topicCount}
              lessonCount={level.lessonCount}
              progressPercent={progress?.percent}
              locked={Boolean(progress && !progress.unlocked)}
              href={`/levels/${level.slug}`}
            />
          );
        })}
      </div>

      {hasMoreThanOne ? (
        <p className="mt-6 text-center text-sm text-faint">
          Each level unlocks the next — finish Level N to open Level N+1.
        </p>
      ) : null}
      {!user ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface/60 px-6 py-8 text-center">
          <h2 className="text-lg font-bold">Track your progress across all levels</h2>
          <p className="max-w-md text-sm text-muted">
            Create a free account to unlock lessons, save progress, earn XP and
            collect certificates.
          </p>
          <Link href="/register" className="btn btn-primary">
            Create Free Account
          </Link>
        </div>
      ) : null}
    </div>
  );
}
