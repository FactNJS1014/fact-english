import type { Metadata } from "next";
import { adminListAllQuizzes } from "@/lib/services/admin.service";
import { db } from "@/lib/db";
import { AdminCrudPage, type CrudConfig } from "@/components/admin/crud-page";
import { QuizQuestionsEditor } from "@/components/admin/question-editor";

export const metadata: Metadata = { title: "Quizzes · Admin" };

export default async function AdminQuizzesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const [items, lessons] = await Promise.all([
    adminListAllQuizzes(),
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

  const questionsByQuiz = new Map<string, unknown[]>();
  if (sp.edit) {
    const quizId = items.find((i) => i.id === sp.edit)?.id;
    if (quizId) {
      const qs = await db.quizQuestion.findMany({
        where: { quizId },
        orderBy: { order: "asc" },
        include: { options: { orderBy: { order: "asc" }, select: { text: true, isCorrect: true, order: true } } },
      });
      questionsByQuiz.set(
        quizId,
        qs.map((q) => ({
          question: q.question,
          type: q.type,
          options: q.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect })),
          explanation: q.explanation,
          points: q.points,
        }))
      );
    }
  }

  const config: CrudConfig = {
    kind: "quiz",
    title: "Quizzes",
    description: "20-question quizzes per topic. Correct answers are only stored and checked server-side.",
    returnTo: "/admin/quizzes",
    columns: [
      {
        key: "quiz",
        label: "Quiz",
        render: (i) => {
          const l = i.lesson as { title: string; topic: { course: { title: string; level: { levelNumber: number } } } };
          return (
            <div>
              <p className="font-semibold">{i.title as string}</p>
              <p className="text-xs text-faint">L{l.topic.course.level.levelNumber} · {l.title}</p>
            </div>
          );
        },
      },
      { key: "q", label: "Questions", render: (i) => <span className="font-bold">{(i._count as { questions: number }).questions}</span> },
      { key: "attempts", label: "Attempts", render: (i) => <span className="text-faint">{(i._count as { attempts: number }).attempts}</span> },
      { key: "pass", label: "Pass mark", render: (i) => <span className="text-faint">{i.passingScore as number}%</span> },
    ],
    fields: [
      {
        type: "select",
        name: "lessonId",
        label: "Lesson",
        options: () =>
          lessons.map((l) => ({ value: l.id, label: `L${l.topic.course.level.levelNumber} · ${l.title}` })),
      },
      { type: "text", name: "title", label: "Title", required: true, placeholder: "e.g. Quiz — Introducing Yourself" },
      { type: "text", name: "description", label: "Description (optional)" },
      { type: "number", name: "passingScore", label: "Passing score (%)", min: 1, max: 100 },
      { type: "status" },
    ],
    extraPanel: (item) => {
      const questions = questionsByQuiz.get(String(item.id)) ?? [];
      return <QuizQuestionsEditor quizId={String(item.id)} initial={questions} />;
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
