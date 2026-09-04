import type { Metadata } from "next";
import Link from "next/link";
import { Award, BookCheck, Flame, Headphones, PenLine } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { getProgressSummary } from "@/lib/services/progress.service";
import { getStudentDashboard } from "@/lib/services/student.service";
import { StatCard } from "@/components/ui/stat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "My Progress" };

export default async function ProgressPage() {
  const session = await getSessionUser();
  const [summary, data] = await Promise.all([
    getProgressSummary(session!.id),
    getStudentDashboard(session!.id),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Learning progress
        </h1>
        <p className="mt-1 text-muted">
          Overall completion: <strong className="text-ink">{summary.overallPercent}%</strong> of all published lessons
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BookCheck} label="Lessons completed" value={data.completedLessons} />
        <StatCard icon={Headphones} label="Listening average" value={`${data.listeningAverage}%`} sub={`${data.listeningPassed} passed`} tone="cyan" />
        <StatCard icon={Award} label="Quiz average" value={`${data.quizAverage}%`} sub={`${data.quizPassed} passed`} tone="green" />
        <StatCard icon={Flame} label="Streak" value={`${data.streaks.currentStreak} days`} sub={`longest ${data.streaks.longestStreak} days`} tone="amber" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Levels</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {summary.levels.map((level) => (
            <div key={level.levelId} className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <Link
                    href={`/levels/${level.slug}`}
                    className="font-semibold text-ink hover:text-brand"
                  >
                    Level {level.levelNumber} · {level.label} Business English
                  </Link>
                  <span className="font-bold">{level.percent}%</span>
                </div>
                <ProgressBar
                  value={level.percent}
                  className="mt-2"
                  tone={level.completed ? "green" : "brand"}
                />
                <p className="mt-1 text-xs text-faint">
                  {level.unlocked
                    ? level.completed
                      ? "✓ Completed — certificate earned"
                      : "Unlocked"
                    : "🔒 Complete the previous level to unlock"}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-4 w-4 text-success" /> Certificates
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.certificates.length === 0 ? (
              <p className="text-sm text-muted">
                Complete every course in a level (reading, listening and quizzes
                passed) to earn a certificate. It is created automatically.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {data.certificates.map((c) => (
                  <Link
                    key={c.id}
                    href={`/certificates/${c.id}`}
                    className="flex items-center justify-between rounded-xl border border-line bg-surface-2 px-4 py-3 transition hover:border-success"
                  >
                    <div>
                      <p className="font-semibold">
                        Level {c.level.levelNumber} · {c.level.name}
                      </p>
                      <p className="text-xs text-faint">
                        {c.certificateId} · issued {formatDate(c.issuedAt)}
                      </p>
                    </div>
                    <Award className="h-5 w-5 text-success" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenLine className="h-4 w-4 text-brand" /> Extra practice
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <ProgressRow label="Reading exercises passed" value={data.readingPassed} icon="📖" />
            <ProgressRow label="Writing answers saved" value={data.writingCount} icon="✍️" />
            <ProgressRow label="Bookmarks" value={data.bookmarked} icon="🔖" />
            <p className="mt-2 text-xs text-faint">
              Recent activity is also recorded daily — every completed lesson,
              listening, quiz or exercise counts towards your streak.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProgressRow({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-line bg-surface-2 px-4 py-3">
      <span className="text-muted">
        {icon} {label}
      </span>
      <span className="font-extrabold text-ink">{value}</span>
    </div>
  );
}
