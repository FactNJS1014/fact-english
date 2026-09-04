import type { Metadata } from "next";
import { adminListLevels } from "@/lib/services/admin.service";
import { AdminCrudPage, StatusBadge, type CrudConfig } from "@/components/admin/crud-page";

export const metadata: Metadata = { title: "Levels · Admin" };

export default async function AdminLevelsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const items = await adminListLevels();
  const sp = await searchParams;

  const config: CrudConfig = {
    kind: "level",
    title: "Levels",
    description: "The 5 learning levels: Level 1 Basic → Level 5 Advanced.",
    returnTo: "/admin/levels",
    allowReorder: "level",
    columns: [
      { key: "num", label: "#", render: (i) => <span className="font-black text-brand">{i.levelNumber as number}</span> },
      {
        key: "name",
        label: "Level",
        render: (i) => (
          <div>
            <p className="font-semibold">{i.label as string}</p>
            <p className="text-xs text-faint">{i.name as string}</p>
          </div>
        ),
      },
      { key: "slug", label: "Slug", render: (i) => <code className="text-xs text-accent-cyan">{i.slug as string}</code> },
      {
        key: "status",
        label: "Status",
        render: (i) => <StatusBadge value={i.published as string} />,
      },
    ],
    fields: [
      { type: "text", name: "label", label: "Label (e.g. Basic)", required: true },
      { type: "text", name: "name", label: "Full name (e.g. Basic Business English)", required: true },
      { type: "text", name: "slug", label: "Slug (auto if empty)", hint: "e.g. basic" },
      { type: "number", name: "levelNumber", label: "Level number", min: 1, max: 10 },
      { type: "textarea", name: "description", label: "Description", required: true, rows: 4 },
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
