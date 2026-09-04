"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Info, X, AlertTriangle } from "lucide-react";

type ToastTone = "success" | "info" | "danger";
interface ToastMessage {
  id: number;
  text: string;
  tone: ToastTone;
}

let listener: ((t: ToastMessage) => void) | null = null;
let counter = 0;

export function toast(text: string, tone: ToastTone = "success") {
  listener?.({ id: ++counter, text, tone });
}

const toneClass: Record<ToastTone, string> = {
  success: "border-success/30 bg-surface text-success",
  info: "border-brand/30 bg-surface text-brand",
  danger: "border-danger/30 bg-surface text-danger",
};

export function Toaster() {
  const [items, setItems] = useState<ToastMessage[]>([]);

  useEffect(() => {
    listener = (t) => {
      setItems((prev) => [...prev.slice(-3), t]);
      setTimeout(() => {
        setItems((prev) => prev.filter((i) => i.id !== t.id));
      }, 3500);
    };
    return () => {
      listener = null;
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2">
      {items.map((t) => {
        const Icon =
          t.tone === "success"
            ? CheckCircle2
            : t.tone === "danger"
              ? AlertTriangle
              : Info;
        return (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl shadow-black/30 ${toneClass[t.tone]}`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-ink">{t.text}</span>
            <button
              onClick={() =>
                setItems((prev) => prev.filter((i) => i.id !== t.id))
              }
              aria-label="Dismiss"
              className="text-faint transition hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
