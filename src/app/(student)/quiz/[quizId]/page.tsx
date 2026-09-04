import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getQuizRunner } from "@/lib/services/quiz.service";
import { getSessionUser } from "@/lib/auth";
import { QuizRunner } from "@/components/quiz/quiz-runner";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Quiz" };

export default async function QuizPage({
  params,
  searchParams,
}: {
  params: Promise<{ quizId: string }>;
  searchParams: Promise<{ back?: string }>;
}) {
  const { quizId } = await params;
  const sp = await searchParams;
  const session = await getSessionUser();
  if (!session) notFound();

  const quiz = await getQuizRunner(quizId);
  if (!quiz) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl">
      <nav className="mb-5 flex items-center justify-between gap-3">
        <Link
          href={sp.back && sp.back.startsWith("/") ? sp.back : `/learn/${quiz.lesson.topic.course.slug}/${quiz.lesson.slug}`}
          className="btn btn-ghost btn-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to lesson
        </Link>
        <Badge tone="purple">{quiz.questions.length} questions</Badge>
      </nav>

      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-faint">
          {quiz.lesson.topic.title} · {quiz.lesson.title}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
          {quiz.title}
        </h1>
        {quiz.description ? (
          <p className="mt-1.5 text-sm text-muted">{quiz.description}</p>
        ) : null}
        <p className="mt-2 text-xs text-faint">
          Pass mark: {quiz.passingScore}% · scored server-side on submit
        </p>
      </div>

      <QuizRunner
        quiz={quiz}
        backHref={
          sp.back && sp.back.startsWith("/")
            ? sp.back
            : `/learn/${quiz.lesson.topic.course.slug}/${quiz.lesson.slug}`
        }
      />
    </div>
  );
}
