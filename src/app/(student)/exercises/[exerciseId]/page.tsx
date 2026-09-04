import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import {
  getExerciseById,
  getReadingExerciseById,
} from "@/lib/services/exercise.service";
import { getSessionUser } from "@/lib/auth";
import { ReadingRunner } from "@/components/exercises/reading-runner";
import { WritingPractice } from "@/components/exercises/writing-practice";
import { SpeakingPractice } from "@/components/exercises/speaking-practice";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Exercise" };

interface ReadingQuestionJson {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

export default async function ExercisePage({
  params,
  searchParams,
}: {
  params: Promise<{ exerciseId: string }>;
  searchParams: Promise<{ back?: string }>;
}) {
  const { exerciseId } = await params;
  const sp = await searchParams;
  const session = await getSessionUser();
  if (!session) notFound();

  const back = sp.back && sp.back.startsWith("/") ? sp.back : "/dashboard";

  // Reading exercises live in their own table; writing/speaking in Exercise.
  const reading = await getReadingExerciseById(exerciseId);
  if (reading) {
    const questions = (reading.questions as unknown as ReadingQuestionJson[]).map(
      (q, i) => ({ id: String(i), question: q.question, options: q.options ?? [] })
    );
    return (
      <Shell
        title={reading.title}
        kind="READING"
        back={back}
        fallbackBack={`/learn/${reading.lesson.topic.course.slug}/${reading.lesson.slug}`}
      >
        <ReadingRunner
          exerciseId={reading.id}
          passage={reading.passage}
          questions={questions}
          backHref={back === "/dashboard" ? `/learn/${reading.lesson.topic.course.slug}/${reading.lesson.slug}` : back}
        />
      </Shell>
    );
  }

  const exercise = await getExerciseById(exerciseId);
  if (!exercise) notFound();

  const content =
    typeof exercise.content === "object" && exercise.content !== null
      ? (exercise.content as Record<string, unknown>)
      : {};
  const fallbackBack = `/learn/${exercise.lesson.topic.course.slug}/${exercise.lesson.slug}`;

  // Existing submission (for writing/speaking notes)
  const submission = await db.writingSubmission.findUnique({
    where: { userId_exerciseId: { userId: session.id, exerciseId } },
  });

  return (
    <Shell
      title={exercise.title}
      kind={exercise.kind}
      back={back === "/dashboard" ? fallbackBack : back}
      fallbackBack={fallbackBack}
    >
      {exercise.kind === "SPEAKING" ? (
        <SpeakingPractice
          prompt={exercise.prompt}
          content={{
            dialogue: Array.isArray(content.dialogue)
              ? (content.dialogue as { speaker: string; text: string }[])
              : [],
            expressions: Array.isArray(content.expressions)
              ? (content.expressions as string[])
              : [],
            tip: typeof content.tip === "string" ? content.tip : undefined,
          }}
          backHref={back === "/dashboard" ? fallbackBack : back}
        />
      ) : (
        <WritingPractice
          exerciseId={exercise.id}
          prompt={exercise.prompt}
          content={{
            modelAnswer:
              typeof content.modelAnswer === "string" ? content.modelAnswer : undefined,
            checklist: Array.isArray(content.checklist)
              ? (content.checklist as string[])
              : undefined,
          }}
          backHref={back === "/dashboard" ? fallbackBack : back}
          existingSubmission={
            submission
              ? { content: submission.content, selfReviewed: submission.selfReviewed }
              : null
          }
        />
      )}
    </Shell>
  );
}

function Shell({
  title,
  kind,
  back,
  fallbackBack,
  children,
}: {
  title: string;
  kind: string;
  back: string;
  fallbackBack: string;
  children: React.ReactNode;
}) {
  const tone =
    kind === "READING" ? "brand" : kind === "WRITING" ? "green" : "amber";
  return (
    <div className="mx-auto w-full max-w-3xl">
      <nav className="mb-5 flex items-center justify-between gap-3">
        <Link
          href={back && back.startsWith("/") ? back : fallbackBack}
          className="btn btn-ghost btn-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to lesson
        </Link>
        <Badge tone={tone as "brand"}>{kind} practice</Badge>
      </nav>
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight sm:text-3xl">
        {title}
      </h1>
      {children}
    </div>
  );
}
