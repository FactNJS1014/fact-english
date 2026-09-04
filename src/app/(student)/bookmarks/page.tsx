import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark as BookmarkIcon, BookOpen, ChevronRight } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Bookmarks" };

export default async function BookmarksPage() {
  const session = await getSessionUser();
  const rows = await db.bookmark.findMany({
    where: { userId: session!.id },
    orderBy: { createdAt: "desc" },
  });

  const lessonIds = rows
    .filter((r) => r.targetKind === "LESSON")
    .map((r) => r.targetId);
  const courseIds = rows
    .filter((r) => r.targetKind === "COURSE")
    .map((r) => r.targetId);

  const [lessons, courses] = await Promise.all([
    lessonIds.length
      ? db.lesson.findMany({
          where: { id: { in: lessonIds } },
          select: {
            id: true,
            title: true,
            slug: true,
            topic: {
              select: {
                title: true,
                course: { select: { title: true, slug: true, level: { select: { levelNumber: true } } } },
              },
            },
          },
        })
      : Promise.resolve([]),
    courseIds.length
      ? db.course.findMany({
          where: { id: { in: courseIds } },
          select: {
            id: true,
            title: true,
            slug: true,
            shortDescription: true,
            level: { select: { levelNumber: true, label: true } },
          },
        })
      : Promise.resolve([]),
  ]);

  const createdById = new Map(rows.map((r) => [r.targetId, r.createdAt]));

  if (rows.length === 0) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight sm:text-3xl">Bookmarks</h1>
        <EmptyState
          title="No bookmarks yet"
          description="Tap the bookmark icon on any lesson or course to save it here for quick access."
          action={
            <Link href="/levels" className="btn btn-primary">
              Browse levels
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Bookmarks</h1>
      <p className="mb-6 text-sm text-muted">{rows.length} saved item{rows.length === 1 ? "" : "s"}</p>

      <div className="flex flex-col gap-3">
        {courses.map((c) => (
          <Card key={c.id} className="card-hover flex items-center gap-4 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <BookOpen className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <Badge tone="brand">Course · Level {c.level.levelNumber}</Badge>
              <Link href={`/courses/${c.slug}`} className="mt-1 block font-bold hover:text-brand">
                {c.title}
              </Link>
              <p className="mt-0.5 truncate text-xs text-faint">{c.shortDescription}</p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-faint" />
          </Card>
        ))}
        {lessons.map((l) => (
          <Link key={l.id} href={`/learn/${l.topic.course.slug}/${l.slug}`}>
            <Card className="card-hover flex items-center gap-4 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/15 text-warning">
                <BookmarkIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <Badge>Lesson</Badge>
                <p className="mt-1 font-bold text-ink hover:text-brand">{l.title}</p>
                <p className="mt-0.5 truncate text-xs text-faint">
                  {l.topic.course.title} · {l.topic.title}
                  {createdById.get(l.id)
                    ? ` · saved ${formatDate(createdById.get(l.id)!)}`
                    : ""}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-faint" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
