"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { submitReadingAction } from "@/lib/actions/learning.actions";
import type { ReadingRunnerQuestion } from "@/lib/services/exercise.service";
import { Button } from "../ui/primitives";
import { Card } from "../ui/card";
import { ProgressBar } from "../ui/progress";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";

const LETTERS = ["A", "B", "C", "D"];

export function ReadingRunner({
  exerciseId,
  passage,
  questions,
  backHref,
}: {
  exerciseId: string;
  passage: string;
  questions: ReadingRunnerQuestion[];
  backHref: string;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<
    | {
        percentage: number;
        passed: boolean;
        score: number;
        totalQuestions: number;
        review: {
          question: string;
          userAnswer: string;
          correctAnswer: string;
          isCorrect: boolean;
          explanation: string | null;
        }[];
      }
    | null
  >(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const answered = Object.keys(answers).length;
  const total = questions.length;

  const submit = async () => {
    if (answered < total) {
      const ok = window.confirm(
        `${total - answered} question${total - answered === 1 ? "" : "s"} not answered. Submit anyway?`
      );
      if (!ok) return;
    }
    setBusy(true);
    const res = await submitReadingAction(exerciseId, answers);
    setBusy(false);
    if (res.ok && res.result && res.result.ok) {
      setResult(res.result);
      if (res.result.passed) router.refresh();
    } else if (res.code === "UNAUTHENTICATED") {
      router.push("/login?expired=1");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <Card className="p-5 sm:p-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-faint">Reading passage</h2>
        <p className="mt-3 whitespace-pre-wrap text-[0.95rem] leading-relaxed text-ink/90">
          {passage}
        </p>
      </Card>

      {result ? (
        <Card className={cn("border-2 p-6 text-center", result.passed ? "border-success/40" : "border-danger/40")}>
          <div
            className={cn(
              "mx-auto flex h-14 w-14 items-center justify-center rounded-full",
              result.passed ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
            )}
          >
            {result.passed ? <CheckCircle2 className="h-7 w-7" /> : <XCircle className="h-7 w-7" />}
          </div>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-faint">Your score</p>
          <p className="mt-1 text-4xl font-black">{result.percentage}%</p>
          <p
            className={cn(
              "mt-2 inline-block rounded-full px-4 py-1 text-sm font-extrabold",
              result.passed ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
            )}
          >
            {result.passed ? "PASS" : "FAIL"} · pass mark 70%
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {!result.passed ? (
              <Button onClick={() => { setResult(null); setAnswers({}); }}>
                <RotateCcw className="h-4 w-4" /> Try Again
              </Button>
            ) : null}
            <a href={backHref} className="btn btn-outline">Back to lesson</a>
          </div>
        </Card>
      ) : (
        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">
              Comprehension <span className="text-sm font-normal text-faint">({answered}/{total} answered)</span>
            </h2>
            <ProgressBar value={total ? (answered / total) * 100 : 0} className="hidden w-32 sm:block" />
          </div>
          <div className="flex flex-col gap-5">
            {questions.map((q, qi) => (
              <fieldset key={`${qi}-${q.question.slice(0, 12)}`} className="rounded-2xl border border-line bg-surface-2/60 p-4">
                <legend className="sr-only">Question {qi + 1}</legend>
                <p className="font-medium leading-relaxed">
                  <span className="mr-2 font-bold text-brand">{qi + 1}.</span>
                  {q.question}
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2" role="radiogroup">
                  {q.options.map((option, oi) => {
                    const selected = answers[String(qi)] === option;
                    return (
                      <button
                        key={oi}
                        role="radio"
                        aria-checked={selected}
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [String(qi)]: option }))
                        }
                        className={cn(
                          "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition",
                          selected
                            ? "border-brand bg-brand-soft text-ink"
                            : "border-line bg-surface text-muted hover:text-ink"
                        )}
                      >
                        <span className="font-bold text-faint">{LETTERS[oi] ?? oi + 1}</span>
                        {option}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
          <div className="mt-5 flex justify-end">
            <Button onClick={submit} disabled={busy}>
              {busy ? <Spinner className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              SUBMIT ANSWERS
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
