import type { Metadata } from "next";
import Link from "next/link";
import { Award, BookCheck, Flame, Sparkles } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { getStudentDashboard } from "@/lib/services/student.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { initials, formatDate } from "@/lib/utils";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = (await getSessionUser())!;
  const data = await getStudentDashboard(session.id);
  const { user } = data;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-5">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-accent-purple text-xl font-black text-white shadow-lg shadow-brand/25">
          {initials(user!.firstName, user!.lastName)}
        </span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {user!.firstName} {user!.lastName}
          </h1>
          <p className="text-muted">
            @{user!.username} · {user!.email}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge tone="purple"><Sparkles className="h-3 w-3" /> {user!.xp} XP</Badge>
            <Badge tone="amber"><Flame className="h-3 w-3" /> {data.streaks.currentStreak}-day streak</Badge>
            <Badge>Member since {formatDate(user!.createdAt)}</Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ProfileStat label="Lessons completed" value={data.completedLessons} />
        <ProfileStat label="Quiz average" value={`${data.quizAverage}%`} />
        <ProfileStat label="Listening average" value={`${data.listeningAverage}%`} />
        <ProfileStat label="Longest streak" value={`${data.streaks.longestStreak} days`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal information</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileForm
              firstName={user!.firstName}
              lastName={user!.lastName}
              email={user!.email}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-4 w-4 text-brand" /> Achievements (
              {data.achievements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.achievements.length === 0 ? (
              <p className="text-sm text-muted">
                No achievements yet — your first lesson, quiz, listening pass,
                course completion and streaks all unlock badges.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {data.achievements.map((a) => (
                  <div
                    key={a.id}
                    title={a.achievement.description}
                    className="flex items-center gap-2.5 rounded-xl border border-line bg-surface-2 px-3 py-2.5"
                  >
                    <span className="text-2xl">{a.achievement.icon}</span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold">{a.achievement.title}</p>
                      <p className="text-[0.65rem] text-faint">
                        {formatDate(a.awardedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookCheck className="h-4 w-4 text-success" /> Certificates (
            {data.certificates.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.certificates.length === 0 ? (
            <p className="text-sm text-muted">
              Complete all courses of a level to earn your FactBusiness English
              certificate.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {data.certificates.map((c) => (
                <Link
                  key={c.id}
                  href={`/certificates/${c.id}`}
                  className="flex items-center justify-between rounded-xl border border-success/30 bg-success/5 px-4 py-3.5 transition hover:border-success"
                >
                  <div>
                    <p className="font-bold">
                      Level {c.level.levelNumber} · {c.level.label}
                    </p>
                    <p className="text-xs text-faint">
                      {c.certificateId} · {formatDate(c.issuedAt)}
                    </p>
                  </div>
                  <Award className="h-6 w-6 text-success" />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-faint">{label}</p>
      <p className="mt-1 text-xl font-extrabold text-ink">{value}</p>
    </div>
  );
}
