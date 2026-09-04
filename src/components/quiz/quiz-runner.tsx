"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Flag,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { submitQuizAction } from "@/lib/actions/learning.actions";
import type { QuizRunnerQuestion } from "@/lib/services/quiz.service";
import type { QuizReviewItem } from "@/lib/services/quiz.service";
import { Button } from "../ui/primitives";
import { Card } from "../ui/card";
import { ProgressBar } from "../ui/progress";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";

interface QuizPayload {
  id: string;
  title: string;
  passingScore: number;
  questions: QuizRunnerQuestion[];
}

type Result = {
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  perfect: boolean;
  passingScore: number;
  review: QuizReviewItem[];
};

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function QuizRunner({
  quiz,
  backHref,
}: {
  quiz: QuizPayload;
  backHref: string;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const router = useRouter();
  const startedAt = useRef<number | null>(null);

  const total = quiz.questions.length;
  const question = quiz.questions[step];
  const answeredCount = Object.keys(answers).length;
  const progress = total === 0 ? 0 : Math.round((answeredCount / total) * 100);

  const unanswered = useMemo(
    () => quiz.questions.filter((q) => !answers[q.id]),
    [answers, quiz.questions]
  );

  if (!question) {
    return (
      <Card className="p-8 text-center text-muted">
        This quiz has no questions yet.
      </Card>
    );
  }

  const select = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const submit = async () => {
    if (startedAt.current === null) startedAt.current = Date.now();
    if (unanswered.length > 0) {
      const ok = window.confirm(
        `${unanswered.length} question${unanswered.length === 1 ? "" : "s"} not answered yet. Submit anyway?`
      );
      if (!ok) return;
    }
    setBusy(true);
    setError(null);
    const res = await submitQuizAction(quiz.id, answers);
    setBusy(false);
    if (res.ok && res.result && res.result.ok) {
      setResult(res.result);
      setElapsedMs(startedAt.current !== null ? Date.now() - startedAt.current : 0);
      if (res.result.passed) {
        router.refresh();
      }
    } else if (res.code === "UNAUTHENTICATED") {
      router.push("/login?expired=1");
    } else {
      setError(res.error ?? "Submission failed. Please try again.");
    }
  };

  const retry = () => {
    setAnswers({});
    setStep(0);
    setResult(null);
    setError(null);
    startedAt.current = null;
    setElapsedMs(0);
  };

  // ------------------------------------------------ result screen
  if (result) {
    const elapsed = Math.round(elapsedMs / 1000);
    const mm = Math.floor(elapsed / 60);
    const ss = String(elapsed % 60).padStart(2, "0");
    return (
      <div className="flex flex-col gap-5">
        <Card
          className={cn(
            "overflow-hidden border-2 p-6 text-center sm:p-8",
            result.passed ? "border-success/40" : "border-danger/40"
          )}
        >
          <div
            className={cn(
              "mx-auto flex h-16 w-16 items-center justify-center rounded-full",
              result.passed ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
            )}
          >
            {result.passed ? (
              <CheckCircle2 className="h-8 w-8" />
            ) : (
              <XCircle className="h-8 w-8" />
            )}
          </div>
          <p className="mt-3 text-xs font-bold uppercase tracking-widest text-faint">
            Your score
          </p>
          <p className="mt-1 text-5xl font-black tracking-tight">
            {result.percentage}%
          </p>
          <p
            className={cn(
              "mt-2 inline-block rounded-full px-4 py-1 text-sm font-extrabold",
              result.passed
                ? "bg-success/15 text-success"
                : "bg-danger/15 text-danger"
            )}
          >
            {result.passed ? "PASS" : "FAIL"} · pass mark {result.passingScore}%
          </p>
          <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl bg-surface-2 p-3">
              <p className="font-extrabold text-success">
                {result.score} / {result.totalQuestions}
              </p>
              <p className="text-xs text-faint">Correct</p>
            </div>
            <div className="rounded-xl bg-surface-2 p-3">
              <p className="font-extrabold text-danger">
                {result.totalQuestions - result.score}
              </p>
              <p className="text-xs text-faint">Wrong</p>
            </div>
            <div className="rounded-xl bg-surface-2 p-3">
              <p className="font-extrabold text-ink">
                {mm}:{ss}
              </p>
              <p className="text-xs text-faint">Time</p>
            </div>
          </div>
          {result.perfect ? (
            <p className="mt-4 text-sm font-semibold text-warning">
              ⭐ Perfect score!
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {!result.passed ? (
              <Button onClick={retry}>
                <RotateCcw className="h-4 w-4" /> Try Again
              </Button>
            ) : null}
            <a href={backHref} className="btn btn-outline">
              Back to lesson
            </a>
          </div>
        </Card>

        {/* Review */}
        <div>
          <h2 className="mb-3 text-lg font-bold">Review your answers</h2>
          <div className="flex flex-col gap-3">
            {result.review.map((r, i) => (
              <Card key={r.questionId} className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  {r.isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-faint">
                      Question {i + 1} · {r.type.replace(/_/g, " ").toLowerCase()}
                    </p>
                    <p className="mt-1 font-medium leading-relaxed">{r.question}</p>
                    <div className="mt-2 flex flex-col gap-1 text-sm">
                      {r.type === "FILL_BLANK" ? (
                        <>
                          <p>
                            <span className="text-faint">Your answer: </span>
                            <span className={r.isCorrect ? "text-success" : "text-danger"}>
                              {r.userAnswer || "—"}
                            </span>
                          </p>
                          <p>
                            <span className="text-faint">Correct: </span>
                            <span className="text-success">{r.correctAnswer}</span>
                          </p>
                        </>
                      ) : (
                        r.options.map((o, oi) => (
                          <p
                            key={o.id}
                            className={cn(
                              "rounded-lg px-2.5 py-1.5",
                              o.text === r.correctAnswer
                                ? "bg-success/10 text-success"
                                : o.id === r.userAnswer
                                  ? "bg-danger/10 text-danger"
                                  : "text-muted"
                            )}
                          >
                            <span className="mr-2 font-bold text-faint">
                              {LETTERS[oi]}
                            </span>
                            {o.text}
                          </p>
                        ))
                      )}
                    </div>
                    {r.explanation ? (
                      <p className="mt-2.5 rounded-lg border border-line bg-surface-2 px-3 py-2 text-xs leading-relaxed text-muted">
                        💡 {r.explanation}
                      </p>
                    ) : null}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------ question screen
  return (
    <div className="flex flex-col gap-4">
      <Card className="p-3 sm:p-4">
        <div className="flex items-center justify-between px-1 text-xs text-faint">
          <span>
            {answeredCount} of {total} answered
          </span>
          <span className="font-semibold text-ink">
            {step + 1} / {total}
          </span>
        </div>
        <ProgressBar value={progress} className="mt-2" />
      </Card>

      <Card className="p-5 sm:p-7" key={question.id}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="chip !text-accent-purple !border-accent-purple/30 !bg-accent-purple/10">
            Question {step + 1} of {total}
          </span>
          <span className="text-xs text-faint">
            {question.points} pts · {question.type.replace(/_/g, " ").toLowerCase()}
          </span>
        </div>

        <h2 className="mt-4 text-lg font-semibold leading-relaxed sm:text-xl">
          {question.question}
        </h2>

        {question.type === "FILL_BLANK" ? (
          <div className="mt-5">
            <label className="sr-only" htmlFor="fill-answer">
              Type your answer
            </label>
            <input
              id="fill-answer"
              className="input !text-base"
              placeholder="Type your answer…"
              value={answers[question.id] ?? ""}
              onChange={(e) => select(question.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (step < total - 1) setStep((s) => s + 1);
                }
              }}
            />
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-2.5" role="radiogroup" aria-label="Answer options">
            {question.options.map((option, oi) => {
              const selected = answers[question.id] === option.id;
              return (
                <button
                  key={option.id}
                  role="radio"
                  aria-checked={selected}
                  onClick={() => select(question.id, option.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition sm:text-[0.95rem]",
                    selected
                      ? "border-brand bg-brand-soft text-ink shadow-lg shadow-brand/10"
                      : "border-line bg-surface-2 text-muted hover:border-line-strong hover:text-ink"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold",
                      selected ? "bg-brand text-white" : "bg-surface-3 text-faint"
                    )}
                  >
                    {LETTERS[oi] ?? oi + 1}
                  </span>
                  {option.text}
                </button>
              );
            })}
          </div>
        )}
      </Card>

      {error ? (
        <p role="alert" className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ArrowLeft className="h-4 w-4" /> Previous
        </Button>

        {step < total - 1 ? (
          <Button onClick={() => setStep((s) => Math.min(total - 1, s + 1))}>
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={submit} disabled={busy}>
            {busy ? <Spinner className="h-4 w-4" /> : <Flag className="h-4 w-4" />}
            SUBMIT QUIZ
          </Button>
        )}
      </div>
    </div>
  );
}
