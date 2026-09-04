import type { Metadata } from "next";
import { adminListAllVocabulary } from "@/lib/services/admin.service";
import { db } from "@/lib/db";
import { AdminCrudPage, type CrudConfig } from "@/components/admin/crud-page";

export const metadata: Metadata = { title: "Vocabulary · Admin" };

export default async function AdminVocabularyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const [items, lessons] = await Promise.all([
    adminListAllVocabulary(),
    db.lesson.findMany({
      orderBy: [{ topic: { course: { level: { levelNumber: "asc" } } }, order: "asc" }],
      select: {
        id: true,
        title: true,
        topic: {
          select: {
            title: true,
            course: { select: { title: true, level: { select: { levelNumber: true } } } },
          },
        },
      },
      take: 1000,
    }),
  ]);

  const config: CrudConfig = {
    kind: "vocabulary",
    title: "Vocabulary",
    description: "Flashcard words attached to a lesson (10+ per topic recommended).",
    returnTo: "/admin/vocabulary",
    columns: [
      {
        key: "word",
        label: "Word",
        render: (i) => (
          <div>
            <p className="font-bold text-brand">{i.word as string}</p>
            <p className="text-xs text-faint">
              {i.partOfSpeech as string}
              {i.pronunciation ? ` · ${i.pronunciation}` : ""}
            </p>
          </div>
        ),
      },
      {
        key: "meaning",
        label: "Meaning",
        render: (i) => (
          <div className="max-w-xs">
            <p className="text-sm">{i.meaning as string}</p>
            {i.thaiMeaning ? <p className="text-xs text-faint">ไทย: {i.thaiMeaning as string}</p> : null}
          </div>
        ),
      },
      {
        key: "lesson",
        label: "Lesson",
        render: (i) => {
          const l = i.lesson as {
            title: string;
            topic: { course: { title: string; level: { levelNumber: number } } };
          };
          return (
            <span className="text-xs text-muted">
              L{l.topic.course.level.levelNumber} · {l.title}
            </span>
          );
        },
      },
    ],
    fields: [
      {
        type: "select",
        name: "lessonId",
        label: "Lesson",
        options: () =>
          lessons.map((l) => ({
            value: l.id,
            label: `L${l.topic.course.level.levelNumber} · ${l.title}`,
          })),
      },
      { type: "text", name: "word", label: "Word", required: true },
      { type: "text", name: "pronunciation", label: "Pronunciation (e.g. /əˈpɔɪntmənt/)" },
      { type: "text", name: "partOfSpeech", label: "Part of speech", required: true, placeholder: "noun / verb / adjective…" },
      { type: "text", name: "thaiMeaning", label: "Thai meaning (optional)" },
      { type: "text", name: "meaning", label: "English definition", required: true },
      { type: "text", name: "example", label: "Example sentence", required: true },
      { type: "text", name: "businessExample", label: "Business example", required: true },
      { type: "text", name: "audioUrl", label: "Audio URL (optional)" },
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
