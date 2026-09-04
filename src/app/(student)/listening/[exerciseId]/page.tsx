import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Headphones } from "lucide-react";
import { getListeningRunner } from "@/lib/services/listening.service";
import { getSessionUser } from "@/lib/auth";
import { ListeningRunner } from "@/components/listening/listening-runner";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Listening" };

export default async function ListeningPage({
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

  const exercise = await getListeningRunner(exerciseId);
  if (!exercise) notFound();

  const fallbackBack = `/learn/${exercise.lesson.topic.course.slug}/${exercise.lesson.slug}`;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <nav className="mb-5 flex items-center justify-between gap-3">
        <Link
          href={sp.back && sp.back.startsWith("/") ? sp.back : fallbackBack}
          className="btn btn-ghost btn-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to lesson
        </Link>
        <Badge tone="cyan">
          <Headphones className="h-3 w-3" /> {exercise.questions.length} questions
        </Badge>
      </nav>

      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-faint">
          {exercise.lesson.topic.title} · {exercise.lesson.title}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
          {exercise.title}
        </h1>
        <p className="mt-2 text-xs text-faint">
          5 questions · pass mark 70% · replay as many times as you need
        </p>
      </div>

      <ListeningRunner
        exercise={exercise}
        backHref={sp.back && sp.back.startsWith("/") ? sp.back : fallbackBack}
      />
    </div>
  );
}
