"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/primitives";
import { cn } from "@/lib/utils";

export interface FlashcardItem {
  word: string;
  pronunciation?: string | null;
  partOfSpeech: string;
  thaiMeaning?: string | null;
  meaning: string;
  example: string;
  businessExample: string;
}

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

export function FlashcardDeck({ items }: { items: FlashcardItem[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const item = items[index];

  const go = useCallback(
    (delta: number) => {
      setFlipped(false);
      setIndex((i) => (i + delta + items.length) % items.length);
    },
    [items.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (items.length === 0) return null;

  return (
    <div className="mt-4 flex flex-col items-center">
      <div className="mb-2 flex w-full items-center justify-between text-xs text-faint">
        <span aria-live="polite">
          {index + 1} / {items.length}
        </span>
        <span className="hidden sm:block">Use ← → to navigate · Space to flip</span>
      </div>

      <div className="h-72 w-full [perspective:1200px] sm:max-w-xl">
        {/* div[role=button] on purpose — the card contains its own Listen
            <button>, and <button> must not nest inside <button>. */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setFlipped((f) => !f)}
          aria-label={flipped ? "Show front of card" : "Flip card"}
          className="h-full w-full cursor-pointer [transform-style:preserve-3d]"
        >
          <Card
            className={cn(
              "relative h-full w-full cursor-pointer p-6 transition-transform duration-500 [backface-visibility:hidden]",
              flipped && "hidden [transform:rotateY(180deg)]"
            )}
          >
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-faint">
                {item.partOfSpeech}
              </p>
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">
                {item.word}
              </h3>
              {item.pronunciation ? (
                <p className="mt-1 text-sm text-accent-cyan">{item.pronunciation}</p>
              ) : null}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  speak(item.word);
                }}
                className="mt-4 flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted transition hover:text-brand"
              >
                <Volume2 className="h-3.5 w-3.5" /> Listen
              </button>
            </div>
            <p className="absolute bottom-4 left-0 w-full text-center text-xs font-semibold uppercase tracking-widest text-faint">
              Click to flip
            </p>
          </Card>

          <Card
            className={cn(
              "absolute inset-0 hidden flex-col justify-between overflow-y-auto p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]",
              flipped && "flex"
            )}
          >
            <div>
              <p className="text-sm font-semibold text-brand">Thai meaning</p>
              <p className="mt-1 text-lg font-bold">{item.thaiMeaning ?? "—"}</p>
              <p className="mt-3 text-sm font-semibold text-accent-cyan">English definition</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{item.meaning}</p>
            </div>
            <div className="mt-3 flex flex-col gap-1.5 text-sm">
              <p>
                <span className="font-semibold text-ink">Example: </span>
                <span className="text-muted">{item.example}</span>
              </p>
              <p>
                <span className="font-semibold text-success">Business: </span>
                <span className="text-muted">{item.businessExample}</span>
              </p>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button variant="outline" onClick={() => go(-1)} aria-label="Previous word">
          <ArrowLeft className="h-4 w-4" /> Previous
        </Button>
        <Button variant="primary" onClick={() => setFlipped((f) => !f)}>
          FLIP
        </Button>
        <Button variant="outline" onClick={() => go(1)} aria-label="Next word">
          Next <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
