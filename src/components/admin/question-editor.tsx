"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import {
  replaceQuizQuestionsAction,
  replaceListeningQuestionsAction,
} from "@/lib/actions/admin.actions";
import { toast } from "../ui/toast";
import { Button } from "../ui/primitives";
import { Spinner } from "../ui/spinner";

export function QuizQuestionsEditor({
  quizId,
  initial,
}: {
  quizId: string;
  initial: unknown[];
}) {
  const [value, setValue] = useState(() => JSON.stringify(initial, null, 2));
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const save = async () => {
    setBusy(true);
    const res = await replaceQuizQuestionsAction(quizId, value);
    setBusy(false);
    if (res.ok) {
      toast("Quiz questions replaced. Attempt history is preserved.");
      router.refresh();
    } else {
      toast(res.error ?? "Invalid JSON", "danger");
    }
  };

  return (
    <EditorShell
      value={value}
      onChange={setValue}
      onSave={save}
      busy={busy}
      hint="JSON array of questions: { question, type: MULTIPLE_CHOICE | TRUE_FALSE | FILL_BLANK, options: [{ text, isCorrect }], explanation, points }"
      example='[{"question":"Which word means …?","type":"MULTIPLE_CHOICE","options":[{"text":"answer A","isCorrect":true},{"text":"answer B","isCorrect":false}],"explanation":"Short explanation"}]'
    />
  );
}

export function ListeningQuestionsEditor({
  exerciseId,
  initial,
}: {
  exerciseId: string;
  initial: unknown[];
}) {
  const [value, setValue] = useState(() => JSON.stringify(initial, null, 2));
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const save = async () => {
    setBusy(true);
    const res = await replaceListeningQuestionsAction(exerciseId, value);
    setBusy(false);
    if (res.ok) {
      toast("Listening questions replaced.");
      router.refresh();
    } else {
      toast(res.error ?? "Invalid JSON", "danger");
    }
  };

  return (
    <EditorShell
      value={value}
      onChange={setValue}
      onSave={save}
      busy={busy}
      hint='JSON array: { question, type: MULTIPLE_CHOICE | TRUE_FALSE | FILL_BLANK, options: ["A","B","C","D"], answer: "correct option text or typed answer", explanation }'
      example='[{"question":"What time will the meeting start?","type":"MULTIPLE_CHOICE","options":["9:00 AM","10:00 AM","11:00 AM","2:00 PM"],"answer":"10:00 AM","explanation":"The manager says the meeting starts at ten."}]'
    />
  );
}

function EditorShell({
  value,
  onChange,
  onSave,
  busy,
  hint,
  example,
}: {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  busy: boolean;
  hint: string;
  example: string;
}) {
  return (
    <div className="card p-5">
      <h3 className="font-bold">Questions</h3>
      <p className="mt-1 text-xs text-muted">{hint}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        rows={16}
        className="input mt-3 font-mono !text-xs leading-relaxed"
        aria-label="Questions JSON"
      />
      <p className="mt-2 text-[0.7rem] text-faint">Example: {example.slice(0, 160)}…</p>
      <div className="mt-3">
        <Button onClick={onSave} disabled={busy}>
          {busy ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          Replace questions (server-side validation)
        </Button>
      </div>
    </div>
  );
}
