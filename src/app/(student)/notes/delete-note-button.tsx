"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteNoteAction } from "@/lib/actions/learning.actions";
import { toast } from "@/components/ui/toast";

export function DeleteNoteButton({
  lessonId,
  returnPath,
}: {
  lessonId: string;
  returnPath: string;
}) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  return (
    <button
      aria-label="Delete note"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        const res = await deleteNoteAction(lessonId, returnPath);
        setBusy(false);
        if (res.ok) {
          toast("Note deleted.");
          router.refresh();
        }
      }}
      className="rounded-lg p-1.5 text-faint transition hover:bg-danger/10 hover:text-danger"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
