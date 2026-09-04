"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Eye, Save } from "lucide-react";
import {
  submitWritingAction,
  markSelfReviewedAction,
} from "@/lib/actions/learning.actions";
import { toast } from "../ui/toast";
import { Button } from "../ui/primitives";
import { Card } from "../ui/card";
import { Spinner } from "../ui/spinner";

export interface ExerciseContent {
  modelAnswer?: string;
  checklist?: string[];
}

export function WritingPractice({
  exerciseId,
  prompt,
  content,
  backHref,
  existingSubmission,
}: {
  exerciseId: string;
  prompt: string;
  content: ExerciseContent | null;
  backHref: string;
  existingSubmission?: { content: string; selfReviewed: boolean } | null;
}) {
  const [text, setText] = useState(existingSubmission?.content ?? "");
  const [busy, setBusy] = useState(false);
  const [showModel, setShowModel] = useState(Boolean(existingSubmission?.selfReviewed));
  const [reviewed, setReviewed] = useState(Boolean(existingSubmission?.selfReviewed));
  const router = useRouter();

  const save = async () => {
    if (busy || text.trim().length < 20) return;
    setBusy(true);
    const res = await submitWritingAction(exerciseId, text.trim());
    setBusy(false);
    if (res.ok) {
      toast("Answer saved. Now compare it with the model answer.");
      router.refresh();
    } else if (res.code === "UNAUTHENTICATED") {
      router.push("/login?expired=1");
    } else {
      toast(res.error ?? "Could not save.", "danger");
    }
  };

  const markReviewed = async () => {
    await markSelfReviewedAction(exerciseId);
    setReviewed(true);
    toast("Marked as reviewed. Great self-reflection!");
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-5">
      <Card className="p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-faint">Your task</p>
        <h2 className="mt-2 text-lg font-semibold leading-relaxed">{prompt}</h2>
      </Card>

      <Card className="p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-faint">Your answer</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Write your answer here — at least a few full sentences…"
          className="input mt-3 leading-relaxed"
        />
        <p className="mt-2 text-xs text-faint">
          {text.trim().length} characters · aim for 40+ words
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={save} disabled={busy || text.trim().length < 20}>
            {busy ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            Save my answer
          </Button>
          {text.trim().length >= 20 ? (
            <Button variant="outline" onClick={() => setShowModel((s) => !s)}>
              <Eye className="h-4 w-4" /> {showModel ? "Hide" : "Show"} model answer
            </Button>
          ) : null}
        </div>
      </Card>

      {showModel && content?.modelAnswer ? (
        <Card className="overflow-hidden border-success/30">
          <div className="border-b border-line bg-success/10 px-5 py-3">
            <p className="text-sm font-bold text-success">Model answer</p>
          </div>
          <div className="p-5">
            <p className="whitespace-pre-wrap text-[0.95rem] leading-relaxed text-muted">
              {content.modelAnswer}
            </p>
            {content.checklist && content.checklist.length > 0 ? (
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-faint">Self-review checklist</p>
                <ul className="mt-2 flex flex-col gap-1">
                  {content.checklist.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success/80" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {!reviewed ? (
              <Button variant="primary" className="mt-4" onClick={markReviewed}>
                <CheckCircle2 className="h-4 w-4" /> I compared my answer — mark as reviewed
              </Button>
            ) : (
              <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-success">
                <CheckCircle2 className="h-4 w-4" /> Marked as reviewed
              </p>
            )}
          </div>
        </Card>
      ) : null}

      <a href={backHref} className="btn btn-ghost self-start">
        ← Back to lesson
      </a>
    </div>
  );
}
