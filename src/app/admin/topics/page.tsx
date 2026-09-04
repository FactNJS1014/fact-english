import type { Metadata } from "next";
import { adminListAllTopics } from "@/lib/services/admin.service";
import { db } from "@/lib/db";
import { AdminCrudPage, StatusBadge, type CrudConfig } from "@/components/admin/crud-page";

export const metadata: Metadata = { title: "Topics · Admin" };

export default async function AdminTopicsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const [items, courses] = await Promise.all([
    adminListAllTopics(),
    db.course.findMany({
      orderBy: [{ level: { levelNumber: "asc" } }, { order: "asc" }],
      select: { id: true, title: true, level: { select: { levelNumber: true } } },
      take: 500,
    }),
  ]);

  const config: CrudConfig = {
    kind: "topic",
    title: "Topics",
    description: "A topic sits inside a course and hosts one or more lessons.",
    returnTo: "/admin/topics",
    allowReorder: "topic",
    columns: [
      { key: "order", label: "#", render: (i) => <span className="font-bold text-faint">{i.order as number}</span> },
      {
        key: "topic",
        label: "Topic",
        render: (i) => (
          <div>
            <p className="font-semibold">{i.title as string}</p>
            <p className="max-w-md truncate text-xs text-faint">{i.description as string}</p>
          </div>
        ),
      },
      {
        key: "course",
        label: "Course",
        render: (i) => {
          const c = i.course as { title: string; level: { levelNumber: number } };
          return (
            <span className="text-xs text-muted">
              L{c.level.levelNumber} · {c.title}
            </span>
          );
        },
      },
      { key: "lessons", label: "Lessons", render: (i) => <span>{(i._count as { lessons: number }).lessons}</span> },
      { key: "status", label: "Status", render: (i) => <StatusBadge value={i.published as string} /> },
    ],
    fields: [
      {
        type: "select",
        name: "courseId",
        label: "Course",
        options: () => courses.map((c) => ({ value: c.id, label: `L${c.level.levelNumber} · ${c.title}` })),
      },
      { type: "text", name: "title", label: "Title", required: true },
      { type: "text", name: "slug", label: "Slug (auto if empty)" },
      { type: "textarea", name: "description", label: "Description", required: true, rows: 3 },
      { type: "number", name: "order", label: "Order", min: 0 },
      { type: "difficulty" },
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
