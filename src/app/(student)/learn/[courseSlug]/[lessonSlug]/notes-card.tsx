"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NotebookPen } from "lucide-react";
import { saveNoteAction, deleteNoteAction } from "@/lib/actions/learning.actions";
import { toast } from "@/components/ui/toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/primitives";
import { Spinner } from "@/components/ui/spinner";

export function NotesCard({
  lessonId,
  lessonPath,
  initialNote,
}: {
  lessonId: string;
  lessonPath: string;
  initialNote?: string | null;
}) {
  const [note, setNote] = useState(initialNote ?? "");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const save = async () => {
    if (!note.trim() || busy) return;
    setBusy(true);
    const res = await saveNoteAction(lessonId, note.trim(), lessonPath);
    setBusy(false);
    if (res.ok) {
      toast("Note saved.");
      router.refresh();
    } else if (res.code === "UNAUTHENTICATED") {
      router.push("/login?expired=1");
    }
  };

  const remove = async () => {
    setBusy(true);
    const res = await deleteNoteAction(lessonId, lessonPath);
    setBusy(false);
    if (res.ok) {
      setNote("");
      toast("Note deleted.");
      router.refresh();
    }
  };

  return (
    <Card className="p-4">
      <p className="flex items-center gap-2 text-sm font-bold">
        <NotebookPen className="h-4 w-4 text-brand" /> Personal notes
      </p>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder='e.g. จำคำว่า "negotiation" — การเจรจา'
        rows={3}
        className="input mt-2.5 !min-h-20 text-sm"
        aria-label="Your notes for this lesson"
      />
      <div className="mt-2 flex gap-2">
        <Button size="sm" onClick={save} disabled={busy || !note.trim()}>
          {busy ? <Spinner className="h-3.5 w-3.5" /> : null} Save note
        </Button>
        {initialNote ? (
          <Button size="sm" variant="ghost" onClick={remove} disabled={busy}>
            Delete
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
