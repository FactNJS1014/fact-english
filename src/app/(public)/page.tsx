import Link from "next/link";
import { unstable_cache } from "next/cache";
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  Headphones,
  LineChart,
  MessageSquareText,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { getLevelsWithStats } from "@/lib/services/content.service";
import { getSessionUser } from "@/lib/auth";
import { LevelCard } from "@/components/courses/course-card";
import { Badge } from "@/components/ui/badge";
import { APP_TAGLINE } from "@/lib/constants";

const cachedLevels = unstable_cache(
  async () => getLevelsWithStats(),
  ["home-levels"],
  { revalidate: 120 }
);

export default async function HomePage() {
  const [levels, user] = await Promise.all([cachedLevels(), getSessionUser()]);
  const baseUrl = user ? "/levels" : "/levels";

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 20% 0%, rgba(59,130,246,0.22), transparent 60%), radial-gradient(ellipse 50% 45% at 85% 15%, rgba(139,92,246,0.16), transparent 55%), radial-gradient(ellipse 40% 40% at 50% 90%, rgba(34,211,238,0.1), transparent 60%)",
          }}
        />
        <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-4 pb-16 pt-20 text-center sm:px-6 sm:pt-28">
          <Badge tone="brand" className="mb-6 !normal-case !text-xs">
            <Sparkles className="h-3 w-3" /> Level 1 · Basic → Level 5 · Advanced
          </Badge>
          <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            MASTER <span className="gradient-text">BUSINESS ENGLISH</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted sm:text-xl">
            {APP_TAGLINE} Build real communication skills for meetings, emails,
            calls, presentations and negotiations.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href={user ? "/levels" : "/register"} className="btn btn-primary btn-lg">
              Start Learning <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/levels" className="btn btn-outline btn-lg">
              Explore Levels
            </Link>
          </div>
          <div className="mt-14 grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: BookOpenCheck, v: "40+", l: "Courses" },
              { icon: Target, v: "200+", l: "Business Topics" },
              { icon: Headphones, v: "1,000+", l: "Listening Questions" },
              { icon: LineChart, v: "4,000+", l: "Quiz Questions" },
            ].map((s) => (
              <div
                key={s.l}
                className="flex flex-col items-center gap-1.5 rounded-2xl border border-line bg-surface/70 px-3 py-4 backdrop-blur"
              >
                <s.icon className="h-5 w-5 text-brand" />
                <p className="text-xl font-extrabold text-ink">{s.v}</p>
                <p className="text-xs font-medium uppercase tracking-wider text-faint">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Levels */}
      <section id="levels" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <Badge tone="cyan">Learning Path</Badge>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Five levels. One clear path to fluency.
            </h2>
            <p className="mt-2 max-w-2xl text-muted">
              Each level unlocks the next. Finish every course and quiz to earn
              your FactBusiness English certificate.
            </p>
          </div>
          <Link href="/levels" className="btn btn-ghost shrink-0">
            All levels <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {levels.map((level) => (
            <LevelCard
              key={level.id}
              levelNumber={level.levelNumber}
              label={level.label}
              description={level.description}
              courseCount={level.courseCount}
              topicCount={level.topicCount}
              lessonCount={level.lessonCount}
              href={`${baseUrl}/${level.slug}`}
            />
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="border-y border-line bg-surface/40">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-8 text-center">
            <Badge tone="purple">What you practice</Badge>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
              Every lesson builds workplace communication
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MessageSquareText, t: "Business Conversations", d: "Real dialogues for meetings, calls, clients and colleagues." },
              { icon: BookOpenCheck, t: "Vocabulary + Grammar", d: "10–20 key words per topic plus the grammar you need at work." },
              { icon: Headphones, t: "Listening Practice", d: "Audio exercises with 5 questions, scoring and retry." },
              { icon: TrendingUp, t: "Quizzes & Progress", d: "20-question quizzes, XP, streaks, achievements and certificates." },
            ].map((f) => (
              <div key={f.t} className="card p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-bold">{f.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-surface-2 via-surface to-surface-2 px-6 py-14 text-center sm:px-12">
          <Award className="mx-auto h-10 w-10 text-brand" />
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            Earn certificates for every level you complete
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Create your free account, start at Level 1 and progress step by
            step — your dashboard tracks lessons, listening, quizzes, streaks
            and certificates.
          </p>
          <Link
            href={user ? "/dashboard" : "/register"}
            className="btn btn-primary btn-lg mt-7"
          >
            {user ? "Go to Dashboard" : "Create Free Account"}
          </Link>
        </div>
      </section>
    </div>
  );
}
