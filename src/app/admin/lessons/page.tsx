import type { Metadata } from "next";
import Link from "next/link";
import { Eye } from "lucide-react";
import { adminListAllLessons } from "@/lib/services/admin.service";
import { db } from "@/lib/db";
import { AdminCrudPage, StatusBadge, type CrudConfig } from "@/components/admin/crud-page";

export const metadata: Metadata = { title: "Lessons · Admin" };

export default async function AdminLessonsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const [items, topics] = await Promise.all([
    adminListAllLessons(),
    db.topic.findMany({
      orderBy: [{ course: { level: { levelNumber: "asc" } }, order: "asc" }],
      select: {
        id: true,
        title: true,
        course: {
          select: { title: true, slug: true, level: { select: { levelNumber: true } } },
        },
      },
      take: 600,
    }),
  ]);

  const config: CrudConfig = {
    kind: "lesson",
    title: "Lessons",
    description: "Lesson content supports markdown: headings, lists, quotes, code blocks.",
    returnTo: "/admin/lessons",
    columns: [
      {
        key: "lesson",
        label: "Lesson",
        render: (i) => {
          const t = i.topic as {
            title: string;
            course: { title: string; slug: string; level: { levelNumber: number } };
          };
          return (
            <div>
              <p className="font-semibold">{i.title as string}</p>
              <p className="text-xs text-faint">
                L{t.course.level.levelNumber} · {t.course.title} · {t.title}
              </p>
            </div>
          );
        },
      },
      { key: "order", label: "#", render: (i) => <span className="text-faint">{i.order as number}</span> },
      { key: "min", label: "Min", render: (i) => <span className="text-faint">{i.durationMinutes as number}′</span> },
      { key: "status", label: "Status", render: (i) => <StatusBadge value={i.published as string} /> },
      {
        key: "preview",
        label: "",
        render: (i) => {
          const t = i.topic as { course: { slug: string } };
          return (
            <Link
              href={`/learn/${t.course.slug}/${i.slug}`}
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-line text-muted hover:text-brand"
              aria-label="Preview lesson"
            >
              <Eye className="h-3.5 w-3.5" />
            </Link>
          );
        },
      },
    ],
    fields: [
      {
        type: "select",
        name: "topicId",
        label: "Topic",
        options: () =>
          topics.map((t) => ({
            value: t.id,
            label: `L${t.course.level.levelNumber} · ${t.course.title} — ${t.title}`,
          })),
      },
      { type: "text", name: "title", label: "Title", required: true },
      { type: "text", name: "slug", label: "Slug (auto if empty)" },
      { type: "textarea", name: "summary", label: "Short summary (optional)", rows: 2 },
      {
        type: "textarea",
        name: "objectives",
        label: "Learning objectives (one per line)",
        required: true,
        rows: 4,
        hint: "Each line becomes a bullet point",
      },
      {
        type: "textarea",
        name: "content",
        label: "Lesson content (markdown)",
        required: true,
        rows: 14,
        hint: "## headings · - lists · > callouts · **bold** · ``` code ```",
      },
      { type: "number", name: "order", label: "Order", min: 0 },
      { type: "number", name: "durationMinutes", label: "Duration (minutes)", min: 1, max: 600 },
      { type: "status" },
    ],
  };

  return (
    <AdminCrudPage
      config={config}
      items={items as unknown as Record<string, unknown>[]}
      searchParams={sp}
    />
  );
}
