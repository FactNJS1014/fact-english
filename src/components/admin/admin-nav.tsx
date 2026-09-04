"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookA,
  BookOpen,
  BookText,
  GraduationCap,
  Headphones,
  Layers,
  ListChecks,
  Mic,
  NotebookText,
  PenLine,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sections: {
  href: string;
  label: string;
  icon: typeof BarChart3;
  exact?: boolean;
}[] = [
  { href: "/admin", label: "Overview", icon: BarChart3, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/levels", label: "Levels", icon: GraduationCap },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/topics", label: "Topics", icon: Layers },
  { href: "/admin/lessons", label: "Lessons", icon: BookText },
  { href: "/admin/vocabulary", label: "Vocabulary", icon: BookA },
  { href: "/admin/grammar", label: "Grammar", icon: NotebookText },
  { href: "/admin/listening", label: "Listening", icon: Headphones },
  { href: "/admin/quizzes", label: "Quizzes", icon: ListChecks },
  { href: "/admin/exercises", label: "Exercises", icon: PenLine },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <div className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
      {sections.map((s) => {
        const active = s.exact ? pathname === s.href : pathname.startsWith(s.href);
        return (
          <Link
            key={s.href}
            href={s.href}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition",
              active
                ? "bg-brand-soft text-brand"
                : "text-muted hover:bg-surface-2 hover:text-ink"
            )}
          >
            <s.icon className="h-4 w-4" />
            {s.label}
          </Link>
        );
      })}
      <span className="flex items-center gap-1.5 px-1 text-sm text-faint">
        <Mic className="h-4 w-4" />
      </span>
    </div>
  );
}
