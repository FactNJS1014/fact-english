import type { Metadata } from "next";
import { adminListAllGrammar } from "@/lib/services/admin.service";
import { db } from "@/lib/db";
import { AdminCrudPage, type CrudConfig } from "@/components/admin/crud-page";

export const metadata: Metadata = { title: "Grammar · Admin" };

export default async function AdminGrammarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const [items, topics] = await Promise.all([
    adminListAllGrammar(),
    db.topic.findMany({
      orderBy: [{ course: { level: { levelNumber: "asc" } }, order: "asc" }],
      select: {
        id: true,
        title: true,
        course: { select: { title: true, level: { select: { levelNumber: true } } } },
      },
      take: 600,
    }),
  ]);

  const config: CrudConfig = {
    kind: "grammar",
    title: "Grammar",
    description: "Grammar focus blocks attached to a topic: rule, structure, examples, mistakes.",
    returnTo: "/admin/grammar",
    columns: [
      {
        key: "title",
        label: "Grammar point",
        render: (i) => (
          <div>
            <p className="font-semibold">{i.title as string}</p>
            <p className="max-w-md truncate text-xs text-faint">{i.explanation as string}</p>
          </div>
        ),
      },
      {
        key: "topic",
        label: "Topic",
        render: (i) => {
          const t = i.topic as {
            title: string;
            course: { title: string; level: { levelNumber: number } };
          };
          return (
            <span className="text-xs text-muted">
              L{t.course.level.levelNumber} · {t.title}
            </span>
          );
        },
      },
      { key: "n", label: "Examples", render: (i) => <span className="text-sm text-faint">{(i.examples as string[]).length}</span> },
    ],
    fields: [
      {
        type: "select",
        name: "topicId",
        label: "Topic",
        options: () =>
          topics.map((t) => ({
            value: t.id,
            label: `L${t.course.level.levelNumber} · ${t.title}`,
          })),
      },
      { type: "text", name: "title", label: "Title (e.g. Present Simple in the office)", required: true },
      { type: "textarea", name: "explanation", label: "The rule (explanation)", required: true, rows: 4 },
      { type: "text", name: "structure", label: "Structure (e.g. Subject + verb + object)", required: true },
      {
        type: "textarea",
        name: "examples",
        label: "Example sentences (one per line)",
        required: true,
        rows: 4,
      },
      {
        type: "textarea",
        name: "businessExamples",
        label: "Business examples (one per line)",
        required: true,
        rows: 4,
      },
      {
        type: "textarea",
        name: "commonMistakes",
        label: "Common mistakes (one per line, with correction)",
        required: true,
        rows: 4,
      },
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
