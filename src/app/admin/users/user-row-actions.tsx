"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, ShieldCheck, ShieldOff, Trash2 } from "lucide-react";
import {
  patchUserAction,
  resetUserProgressAction,
} from "@/lib/actions/admin.actions";
import { toast } from "@/components/ui/toast";

export function UserRowActions({
  user,
}: {
  user: {
    id: string;
    role: "STUDENT" | "ADMIN";
    isActive: boolean;
    bypassLevelLock: boolean;
  };
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const router = useRouter();

  const run = async (kind: string, fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setBusy(kind);
    const res = await fn();
    setBusy(null);
    if (res.ok) {
      toast("Updated.");
      router.refresh();
    } else {
      toast(res.error ?? "Failed", "danger");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <button
        onClick={() =>
          run("active", () => patchUserAction(user.id, { isActive: !user.isActive }))
        }
        disabled={busy !== null}
        title={user.isActive ? "Deactivate" : "Activate"}
        className={`flex h-7 w-7 items-center justify-center rounded-lg border text-xs transition ${
          user.isActive
            ? "border-line text-muted hover:border-danger/50 hover:text-danger"
            : "border-success/40 bg-success/10 text-success"
        }`}
      >
        {user.isActive ? "✕" : "✓"}
      </button>
      <button
        onClick={() =>
          run("role", () =>
            patchUserAction(user.id, {
              role: user.role === "ADMIN" ? "STUDENT" : "ADMIN",
            })
          )
        }
        disabled={busy !== null}
        title={user.role === "ADMIN" ? "Demote to student" : "Promote to admin"}
        className={`flex h-7 w-7 items-center justify-center rounded-lg border text-xs transition ${
          user.role === "ADMIN"
            ? "border-accent-purple/50 text-accent-purple"
            : "border-line text-muted hover:text-accent-purple"
        }`}
      >
        {user.role === "ADMIN" ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldOff className="h-3.5 w-3.5" />}
      </button>
      <button
        onClick={() =>
          run("bypass", () => patchUserAction(user.id, { bypassLevelLock: !user.bypassLevelLock }))
        }
        disabled={busy !== null}
        title={user.bypassLevelLock ? "Remove level access override" : "Unlock all levels (override)"}
        className={`flex h-7 items-center gap-1 rounded-lg border px-2 text-[0.7rem] font-bold transition ${
          user.bypassLevelLock
            ? "border-warning/60 bg-warning/15 text-warning"
            : "border-line text-faint hover:text-warning"
        }`}
      >
        <KeyRound className="h-3 w-3" />
        {user.bypassLevelLock ? "Unlocked" : "Levels"}
      </button>
      <button
        onClick={() => {
          if (!window.confirm("Reset ALL progress for this user? This deletes progress rows, certificates and achievements.")) return;
          run("reset", () => resetUserProgressAction(user.id));
        }}
        disabled={busy !== null}
        title="Reset progress"
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-muted transition hover:border-danger/50 hover:text-danger"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
