import type { Metadata } from "next";
import { adminListAllListening } from "@/lib/services/admin.service";
import { db } from "@/lib/db";
import { AdminCrudPage, type CrudConfig } from "@/components/admin/crud-page";
import { ListeningQuestionsEditor } from "@/components/admin/question-editor";

export const metadata: Metadata = { title: "Listening · Admin" };

export default async function AdminListeningPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const [items, lessons] = await Promise.all([
    adminListAllListening(),
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

  const questionsByExercise = new Map<string, unknown[]>();
  if (sp.edit) {
    const id = items.find((i) => i.id === sp.edit)?.id;
    if (id) {
      const qs = await db.listeningQuestion.findMany({
        where: { listeningExerciseId: id },
        orderBy: { order: "asc" },
      });
      questionsByExercise.set(
        id,
        qs.map((q) => ({
          question: q.question,
          type: q.type,
          options: q.options as string[],
          answer: q.answer,
          explanation: q.explanation,
        }))
      );
    }
  }

  const config: CrudConfig = {
    kind: "listening",
    title: "Listening",
    description: "5-question listening exercises per topic. Add an audioUrl for real audio; otherwise the player reads the transcript aloud.",
    returnTo: "/admin/listening",
    columns: [
      {
        key: "exercise",
        label: "Exercise",
        render: (i) => {
          const l = i.lesson as { title: string; topic: { course: { title: string; level: { levelNumber: number } } } };
          return (
            <div>
              <p className="font-semibold">{i.title as string}</p>
              <p className="max-w-md truncate text-xs text-faint">
                L{l.topic.course.level.levelNumber} · {l.title}
                {i.audioUrl ? " · 🎧 audio attached" : " · TTS"}
              </p>
            </div>
          );
        },
      },
      { key: "q", label: "Questions", render: (i) => <span className="font-bold">{(i._count as { questions: number }).questions}</span> },
      { key: "att", label: "Attempts", render: (i) => <span className="text-faint">{(i._count as { attempts: number }).attempts}</span> },
    ],
    fields: [
      {
        type: "select",
        name: "lessonId",
        label: "Lesson",
        options: () =>
          lessons.map((l) => ({ value: l.id, label: `L${l.topic.course.level.levelNumber} · ${l.title}` })),
      },
      { type: "text", name: "title", label: "Title", required: true, placeholder: "e.g. Listening — A first meeting" },
      { type: "text", name: "audioUrl", label: "Audio URL (optional)", hint: "Public MP3/WAV URL; empty = browser reads the transcript" },
      { type: "number", name: "duration", label: "Duration (seconds)", min: 10, max: 3600 },
      {
        type: "textarea",
        name: "transcript",
        label: "Transcript (what the learner hears)",
        required: true,
        rows: 8,
      },
      { type: "status" },
    ],
    extraPanel: (item) => {
      const questions = questionsByExercise.get(String(item.id)) ?? [];
      return <ListeningQuestionsEditor exerciseId={String(item.id)} initial={questions} />;
    },
  };

  return (
    <AdminCrudPage
      config={config}
      items={items as unknown as Record<string, unknown>[]}
      searchParams={sp}
    />
  );
}
