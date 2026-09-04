"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "info" | "success" | "warning" | "danger";

const toneClass: Record<Tone, string> = {
  info: "border-brand/30 bg-brand-soft text-brand",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  danger: "border-danger/30 bg-danger/10 text-danger",
};

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertTriangle,
};

export function Banner({
  tone = "info",
  children,
  dismissible = true,
  param,
}: {
  tone?: Tone;
  children: React.ReactNode;
  dismissible?: boolean;
  /** When provided, dismissing clears this URL search param. */
  param?: string;
}) {
  const [hidden, setHidden] = useState(false);
  const router = useRouter();
  const dismiss = useCallback(() => {
    setHidden(true);
    if (param) {
      const url = new URL(window.location.href);
      url.searchParams.delete(param);
      router.replace(url.pathname + url.search);
    }
  }, [param, router]);

  if (hidden) return null;
  const Icon = icons[tone];
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium",
        toneClass[tone]
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex-1">{children}</div>
      {dismissible ? (
        <button
          onClick={dismiss}
          aria-label="Dismiss message"
          className="rounded-md p-0.5 opacity-70 transition hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
