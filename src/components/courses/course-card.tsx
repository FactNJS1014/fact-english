import Link from "next/link";
import { BookOpen, Layers, PlayCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { ProgressBar } from "../ui/progress";
import { cn } from "@/lib/utils";

export interface CourseCardData {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  topicCount: number;
  lessonCount: number;
  levelName?: string;
  levelNumber?: number;
  progressPercent?: number;
}

export function CourseCard({
  course,
  levelBadge = true,
}: {
  course: CourseCardData;
  levelBadge?: boolean;
}) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="card card-hover group flex flex-col overflow-hidden"
    >
      <div className="relative flex h-28 items-center justify-center overflow-hidden bg-gradient-to-br from-surface-2 via-surface to-surface-3">
        <div
          aria-hidden
          className="absolute inset-0 opacity-40 transition duration-300 group-hover:opacity-70"
          style={{
            background:
              "radial-gradient(circle at 20% 30%, rgba(59,130,246,0.35), transparent 55%), radial-gradient(circle at 85% 70%, rgba(139,92,246,0.3), transparent 50%), radial-gradient(circle at 60% 10%, rgba(34,211,238,0.25), transparent 45%)",
          }}
        />
        <BookOpen className="relative h-10 w-10 text-ink/70 transition group-hover:scale-110" />
        {course.progressPercent !== undefined &&
        course.progressPercent > 0 ? (
          <div className="absolute inset-x-0 bottom-0 px-4 pb-2">
            <ProgressBar value={course.progressPercent} className="h-1.5" />
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {levelBadge && course.levelNumber ? (
          <Badge tone="brand">Level {course.levelNumber}</Badge>
        ) : null}
        <h3 className="font-bold leading-snug text-ink transition group-hover:text-brand">
          {course.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted">
          {course.shortDescription}
        </p>
        <div className="mt-auto flex items-center gap-4 pt-2 text-xs text-faint">
          <span className="inline-flex items-center gap-1">
            <Layers className="h-3.5 w-3.5" />
            {course.topicCount} topics
          </span>
          <span className="inline-flex items-center gap-1">
            <PlayCircle className="h-3.5 w-3.5" />
            {course.lessonCount} lessons
          </span>
        </div>
      </div>
    </Link>
  );
}

export function LevelCard({
  levelNumber,
  label,
  description,
  courseCount,
  topicCount,
  lessonCount,
  progressPercent,
  locked,
  href,
}: {
  levelNumber: number;
  label: string;
  description: string;
  courseCount: number;
  topicCount: number;
  lessonCount: number;
  progressPercent?: number;
  locked?: boolean;
  href: string;
}) {
  return (
    <div
      className={cn(
        "card card-hover relative flex flex-col gap-4 overflow-hidden p-6",
        locked && "opacity-75"
      )}
    >
      {locked ? (
        <Badge tone="amber" className="absolute right-4 top-4">
          Locked
        </Badge>
      ) : null}
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-accent-purple text-lg font-black text-white shadow-lg shadow-brand/20">
          {levelNumber}
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-faint">
            Level {levelNumber}
          </p>
          <h3 className="text-lg font-extrabold tracking-tight text-ink">{label}</h3>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-muted">{description}</p>
      <div className="grid grid-cols-3 gap-2 text-center">
        <MiniStat value={courseCount} label="Courses" />
        <MiniStat value={topicCount} label="Topics" />
        <MiniStat value={lessonCount} label="Lessons" />
      </div>
      {progressPercent !== undefined ? (
        <div className="flex items-center gap-3">
          <ProgressBar value={progressPercent} className="flex-1" />
          <span className="text-sm font-bold text-ink">{progressPercent}%</span>
        </div>
      ) : null}
      <Link
        href={href}
        className={cn("btn w-full", locked ? "btn-outline" : "btn-primary")}
      >
        {locked ? "View Details" : "Start Learning"}
      </Link>
    </div>
  );
}

function MiniStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl bg-surface-2 px-2 py-2.5">
      <p className="text-lg font-extrabold text-ink">{value}</p>
      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-faint">
        {label}
      </p>
    </div>
  );
}
