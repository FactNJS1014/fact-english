import type { Metadata } from "next";
import { adminListAllCourses } from "@/lib/services/admin.service";
import { db } from "@/lib/db";
import { AdminCrudPage, StatusBadge, type CrudConfig } from "@/components/admin/crud-page";

export const metadata: Metadata = { title: "Courses · Admin" };

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const [items, levels] = await Promise.all([
    adminListAllCourses(),
    db.level.findMany({ orderBy: { levelNumber: "asc" }, select: { id: true, label: true, levelNumber: true } }),
  ]);

  const config: CrudConfig = {
    kind: "course",
    title: "Courses",
    description: "Courses belong to a level and contain ordered topics.",
    returnTo: "/admin/courses",
    allowReorder: "course",
    columns: [
      { key: "order", label: "#", render: (i) => <span className="font-bold text-faint">{i.order as number}</span> },
      {
        key: "course",
        label: "Course",
        render: (i) => (
          <div>
            <p className="font-semibold">{i.title as string}</p>
            <p className="max-w-md truncate text-xs text-faint">{i.shortDescription as string}</p>
          </div>
        ),
      },
      {
        key: "level",
        label: "Level",
        render: (i) => {
          const l = i.level as { label: string; levelNumber: number };
          return <span className="text-xs font-semibold text-muted">L{l.levelNumber} · {l.label}</span>;
        },
      },
      { key: "topics", label: "Topics", render: (i) => <span className="text-sm">{(i._count as { topics: number }).topics}</span> },
      { key: "status", label: "Status", render: (i) => <StatusBadge value={i.published as string} /> },
    ],
    fields: [
      {
        type: "select",
        name: "levelId",
        label: "Level",
        options: () =>
          levels.map((l) => ({ value: l.id, label: `Level ${l.levelNumber} · ${l.label}` })),
      },
      { type: "text", name: "title", label: "Title", required: true },
      { type: "text", name: "slug", label: "Slug (auto if empty)" },
      { type: "text", name: "shortDescription", label: "Short description", required: true },
      { type: "textarea", name: "description", label: "Full description", required: true, rows: 4 },
      { type: "text", name: "thumbnail", label: "Thumbnail URL (optional)" },
      { type: "number", name: "order", label: "Order", min: 0 },
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
