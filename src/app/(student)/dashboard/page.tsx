import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookCheck,
  CheckCircle2,
  Flame,
  Headphones,
  Lock,
  PlayCircle,
  Sparkles,
  Target,
} from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { getStudentDashboard } from "@/lib/services/student.service";
import { StatCard } from "@/components/ui/stat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty";
import { formatDate } from "@/lib/utils";
import { WelcomeBanner } from "./welcome-banner";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await getSessionUser();
  const data = await getStudentDashboard(session!.id);
  const { user, streaks, continueLearning, summary, achievements, certificates } = data;

  const levelLabel = user?.currentLevel
    ? `Level ${user.currentLevel.levelNumber} · ${user.currentLevel.label}`
    : "Not started yet";

  return (
    <div className="flex flex-col gap-6">
      <WelcomeBanner name={user?.firstName ?? ""} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Welcome back{user ? `, ${user.firstName}` : ""} 👋
          </h1>
          <p className="mt-1 text-muted">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="amber">
            <Flame className="h-3.5 w-3.5" /> {streaks.currentStreak}-day streak
          </Badge>
          <Badge tone="purple">
            <Sparkles className="h-3.5 w-3.5" /> {user?.xp ?? 0} XP
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BookCheck} label="Completed Lessons" value={data.completedLessons} sub="keep the streak alive" />
        <StatCard icon={Target} label="Quiz Average" value={`${data.quizAverage}%`} sub={`${data.quizPassed} passed`} tone="green" />
        <StatCard icon={Headphones} label="Listening Average" value={`${data.listeningAverage}%`} sub={`${data.listeningPassed} passed`} tone="cyan" />
        <StatCard icon={Flame} label="Longest Streak" value={`${streaks.longestStreak} days`} sub={streaks.lastActivityAt ? `last active ${formatDate(streaks.lastActivityAt)}` : "start today"} tone="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {continueLearning ? (
            <Card className="overflow-hidden">
              <div className="border-b border-line bg-gradient-to-r from-brand-soft via-transparent to-transparent px-5 py-4 sm:px-6">
                <p className="text-xs font-bold uppercase tracking-widest text-brand">Continue learning</p>
              </div>
              <CardContent className="pt-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-faint">
                      {continueLearning.courseTitle}
                    </p>
                    <h3 className="mt-1 text-lg font-bold">
                      {continueLearning.topicTitle} — {continueLearning.lessonTitle}
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      {continueLearning.completed
                        ? "Lesson completed 🎉"
                        : `${continueLearning.progressPercent}% complete`}
                    </p>
                  </div>
                  <Link
                    href={`/learn/${continueLearning.courseSlug}/${continueLearning.lessonSlug}`}
                    className="btn btn-primary"
                  >
                    {continueLearning.completed ? "Review lesson" : "Continue"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-6">
                <EmptyState
                  title="Ready to start your Business English journey?"
                  description="Pick Level 1 and your first course. Lessons, listening and quizzes will appear here."
                  action={
                    <Link href="/levels" className="btn btn-primary">
                      <PlayCircle className="h-4 w-4" /> Start Learning
                    </Link>
                  }
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Level progress</CardTitle>
                <span className="text-sm text-faint">overall {summary.overallPercent}%</span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {summary.levels.map((level) => (
                <div key={level.levelId} className="flex items-center gap-4">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${
                      level.completed
                        ? "bg-success/15 text-success"
                        : level.unlocked
                          ? "bg-brand-soft text-brand"
                          : "bg-surface-3 text-faint"
                    }`}
                  >
                    {level.completed ? <CheckCircle2 className="h-4 w-4" /> : level.unlocked ? <Target className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">
                        Level {level.levelNumber} · {level.label}
                      </span>
                      <span className="text-faint">{level.percent}%</span>
                    </div>
                    <ProgressBar
                      value={level.percent}
                      className="mt-1.5"
                      tone={level.completed ? "green" : "brand"}
                    />
                  </div>
                  <Link
                    href={`/levels/${level.slug}`}
                    className="hidden text-sm font-semibold text-brand hover:underline sm:block"
                  >
                    View
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-brand" /> Achievements
                </CardTitle>
                <Link href="/profile" className="text-xs font-semibold text-brand hover:underline">
                  View all
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {achievements.length === 0 ? (
                <p className="text-sm text-muted">
                  No achievements yet — complete lessons and quizzes to earn
                  your first badge.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {achievements.slice(0, 8).map((a) => (
                    <span key={a.id} title={a.achievement.description} className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface-2 text-lg">
                      {a.achievement.icon}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-4 w-4 text-success" /> Certificates
              </CardTitle>
            </CardHeader>
            <CardContent>
              {certificates.length === 0 ? (
                <p className="text-sm text-muted">
                  Complete every course in a level to earn your FactBusiness
                  English certificate.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {certificates.slice(0, 3).map((c) => (
                    <Link
                      key={c.id}
                      href={`/certificates/${c.id}`}
                      className="flex items-center justify-between rounded-xl border border-line bg-surface-2 px-3 py-2.5 text-sm transition hover:border-brand"
                    >
                      <span className="font-semibold">Level {c.level.levelNumber} · {c.level.label}</span>
                      <ArrowRight className="h-4 w-4 text-faint" />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Current level</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-bold">{levelLabel}</p>
              {!user?.currentLevel ? (
                <Link href="/levels" className="btn btn-outline btn-sm mt-3 w-full">
                  Choose a level
                </Link>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
