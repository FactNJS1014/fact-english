import type { Metadata } from "next";
import { Activity, Award, BookOpen, Flame, Layers, ListChecks, Users, Volume2 } from "lucide-react";
import { getAdminStats } from "@/lib/services/admin.service";
import { StatCard } from "@/components/ui/stat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminActivityChart } from "./admin-charts";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Admin dashboard
        </h1>
        <p className="mt-1 text-muted">
          Platform analytics and content overview.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} sub={`${stats.activeUsers} active`} />
        <StatCard icon={Flame} label="Active (7 days)" value={stats.activeUsersLast7Days} tone="amber" />
        <StatCard icon={Award} label="Quiz Average" value={`${stats.quizAverage}%`} tone="purple" />
        <StatCard icon={Volume2} label="Listening Average" value={`${stats.listeningAverage}%`} tone="cyan" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Mini label="Levels" value={stats.totalLevels} icon={Layers} />
        <Mini label="Courses" value={stats.totalCourses} icon={BookOpen} />
        <Mini label="Topics" value={stats.totalTopics} icon={Layers} />
        <Mini label="Lessons" value={stats.totalLessons} icon={BookOpen} />
        <Mini label="Quiz Qs" value={stats.totalQuizQuestions} icon={ListChecks} />
        <Mini label="Vocab" value={stats.totalVocabulary} icon={BookOpen} />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4 text-brand" /> Learning activity — last 7 days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AdminActivityChart data={stats.dailyActivity} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Recent signups</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentUsers.length === 0 ? (
              <p className="text-sm text-muted">No users yet.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {stats.recentUsers.map((u) => (
                  <li key={u.id} className="flex items-center justify-between rounded-xl border border-line bg-surface-2 px-3 py-2.5 text-sm">
                    <span className="truncate font-medium">
                      {u.firstName} {u.lastName}
                    </span>
                    <span className="ml-2 shrink-0 text-xs text-faint">
                      {u.role} · {new Date(u.createdAt).toLocaleDateString("en-GB")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 rounded-xl border border-line bg-surface-2 p-3 text-xs leading-relaxed text-faint">
              Course completion across all users is ~{stats.courseCompletionPercent}%
              (completed course-progress records ÷ users × published courses).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Mini({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Users;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-3.5">
      <Icon className="h-4 w-4 text-faint" />
      <p className="mt-2 text-xl font-extrabold text-ink">{value}</p>
      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-faint">{label}</p>
    </div>
  );
}
