"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { replaceReadingQuestionsAction } from "@/lib/actions/admin.actions";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/primitives";
import { Spinner } from "@/components/ui/spinner";

export function DynamicReadingEditor({
  readingId,
  initial,
}: {
  readingId: string;
  initial: unknown[];
}) {
  const [value, setValue] = useState(() => JSON.stringify(initial, null, 2));
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const save = async () => {
    setBusy(true);
    const res = await replaceReadingQuestionsAction(readingId, value);
    setBusy(false);
    if (res.ok) {
      toast("Reading questions replaced.");
      router.refresh();
    } else {
      toast(res.error ?? "Invalid JSON", "danger");
    }
  };

  return (
    <div className="card p-5">
      <h3 className="font-bold">Comprehension questions</h3>
      <p className="mt-1 text-xs text-muted">
        JSON array: {"{ question, options: [\"A\",\"B\",\"C\"], answer: \"correct option text\", explanation }"}
      </p>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        spellCheck={false}
        rows={12}
        className="input mt-3 font-mono !text-xs leading-relaxed"
        aria-label="Reading questions JSON"
      />
      <div className="mt-3">
        <Button onClick={save} disabled={busy}>
          {busy ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          Save questions
        </Button>
      </div>
    </div>
  );
}
