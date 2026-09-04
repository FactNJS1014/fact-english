"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import { toggleBookmarkAction } from "@/lib/actions/learning.actions";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function BookmarkButton({
  targetKind,
  targetId,
  lessonPath,
  initial = false,
}: {
  targetKind: "LESSON" | "COURSE";
  targetId: string;
  lessonPath: string;
  initial?: boolean;
}) {
  const [active, setActive] = useState(initial);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    const res = await toggleBookmarkAction(targetKind, targetId, lessonPath);
    setBusy(false);
    if (res.ok) {
      setActive((v) => !v);
      toast(res.message ?? "Saved");
      router.refresh();
    } else if (res.code === "UNAUTHENTICATED") {
      router.push("/login?expired=1");
    }
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={active}
      aria-label={active ? "Remove bookmark" : "Save bookmark"}
      title={active ? "Remove bookmark" : "Save bookmark"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-xl border transition",
        active
          ? "border-warning/40 bg-warning/15 text-warning"
          : "border-line bg-surface text-muted hover:border-warning/40 hover:text-warning"
      )}
    >
      <Bookmark className={cn("h-4 w-4", active && "fill-current")} />
    </button>
  );
}
