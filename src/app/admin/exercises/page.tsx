import type { Metadata } from "next";
import { adminListAllReading, adminListAllExercises } from "@/lib/services/admin.service";
import { db } from "@/lib/db";
import { AdminCrudPage, StatusBadge, type CrudConfig } from "@/components/admin/crud-page";

export const metadata: Metadata = { title: "Exercises · Admin" };

export default async function AdminExercisesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const [reading, practice, lessons] = await Promise.all([
    adminListAllReading(),
    adminListAllExercises(),
    db.lesson.findMany({
      orderBy: [{ topic: { course: { level: { levelNumber: "asc" } } }, order: "asc" }],
      select: {
        id: true,
        title: true,
        topic: { select: { course: { select: { level: { select: { levelNumber: true } } } } } },
      },
      take: 1000,
    }),
  ]);

  const lessonOptions = () =>
    lessons.map((l) => ({
      value: l.id,
      label: `L${l.topic.course.level.levelNumber} · ${l.title}`,
    }));

  const readingConfig: CrudConfig = {
    kind: "reading",
    title: "Reading exercises",
    description:
      "Business reading passages with comprehension questions (scored server-side). Questions are edited as JSON once the passage is saved.",
    returnTo: "/admin/exercises",
    columns: [
      {
        key: "title",
        label: "Passage",
        render: (i) => {
          const l = i.lesson as { title: string; topic: { course: { level: { levelNumber: number } } } };
          return (
            <div>
              <p className="font-semibold">{i.title as string}</p>
              <p className="max-w-lg truncate text-xs text-faint">
                L{l.topic.course.level.levelNumber} · {l.title}
              </p>
            </div>
          );
        },
      },
      { key: "status", label: "Status", render: (i) => <StatusBadge value={i.published as string} /> },
    ],
    fields: [
      { type: "select", name: "lessonId", label: "Lesson", options: lessonOptions },
      { type: "text", name: "title", label: "Title", required: true },
      { type: "textarea", name: "passage", label: "Passage (email, report, announcement…)", required: true, rows: 10 },
      { type: "number", name: "order", label: "Order", min: 0 },
      { type: "status" },
    ],
    extraPanel: (item) => {
      const questions = (item.questions as unknown[]) ?? [];
      return <ReadingQuestionsEditor readingId={String(item.id)} initial={questions} />;
    },
  };

  const practiceConfig: CrudConfig = {
    kind: "exercise",
    title: "Writing & speaking practice",
    description: "Writing tasks (model answer + self-review checklist) and speaking dialogues (TTS read-along).",
    returnTo: "/admin/exercises",
    columns: [
      {
        key: "kind",
        label: "Kind",
        render: (i) => <StatusBadge value={i.kind as string} />,
      },
      {
        key: "title",
        label: "Title",
        render: (i) => {
          const l = i.lesson as { title: string; topic: { course: { level: { levelNumber: number } } } };
          return (
            <div>
              <p className="font-semibold">{i.title as string}</p>
              <p className="max-w-lg truncate text-xs text-faint">
                L{l.topic.course.level.levelNumber} · {l.title} · {String((i.prompt as string) ?? "").slice(0, 80)}
              </p>
            </div>
          );
        },
      },
      { key: "status", label: "Status", render: (i) => <StatusBadge value={i.published as string} /> },
    ],
    fields: [
      { type: "select", name: "lessonId", label: "Lesson", options: lessonOptions },
      {
        type: "select",
        name: "kind",
        label: "Kind",
        options: () => [
          { value: "WRITING", label: "Writing" },
          { value: "SPEAKING", label: "Speaking" },
        ],
      },
      { type: "text", name: "title", label: "Title", required: true },
      { type: "textarea", name: "prompt", label: "Task / prompt shown to the student", required: true, rows: 4 },
      {
        type: "textarea",
        name: "content",
        label: "Content (JSON)",
        required: true,
        rows: 8,
        hint: 'Writing: {"modelAnswer":"…","checklist":["…"]} · Speaking: {"dialogue":[{"speaker":"Employee","text":"…"}],"expressions":["…"]}',
      },
      { type: "number", name: "order", label: "Order", min: 0 },
      { type: "status" },
    ],
  };

  return (
    <div className="flex flex-col gap-10">
      <AdminCrudPage
        config={readingConfig}
        items={reading as unknown as Record<string, unknown>[]}
        searchParams={sp}
      />
      <AdminCrudPage
        config={practiceConfig}
        items={practice as unknown as Record<string, unknown>[]}
        searchParams={sp}
      />
    </div>
  );
}

function ReadingQuestionsEditor({
  readingId,
  initial,
}: {
  readingId: string;
  initial: unknown[];
}) {
  // Imported lazily to avoid loading the client bundle on list render
  return (
    <DynamicReadingEditor
      readingId={readingId}
      initial={initial}
    />
  );
}

import { DynamicReadingEditor } from "./reading-questions-editor";
