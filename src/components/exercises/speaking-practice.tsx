"use client";

import { useMemo, useState } from "react";
import { Volume2, Mic2 } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/primitives";

export interface SpeakingContent {
  dialogue: { speaker: string; text: string }[];
  expressions: string[];
  tip?: string;
}

export function SpeakingPractice({
  prompt,
  content,
  backHref,
}: {
  prompt: string;
  content: SpeakingContent | null;
  backHref: string;
}) {
  const [playing, setPlaying] = useState<number | null>(null);
  const dialogue = useMemo(
    () => content?.dialogue ?? [],
    [content]
  );

  const speak = (text: string, index: number) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.85;
    u.onend = () => setPlaying(null);
    setPlaying(index);
    window.speechSynthesis.speak(u);
  };

  const playAll = () => {
    if (dialogue.length === 0) return;
    window.speechSynthesis.cancel();
    const speakNext = (i: number) => {
      if (i >= dialogue.length) {
        setPlaying(null);
        return;
      }
      const u = new SpeechSynthesisUtterance(dialogue[i]!.text);
      u.lang = "en-US";
      u.rate = 0.85;
      setPlaying(i);
      u.onend = () => speakNext(i + 1);
      window.speechSynthesis.speak(u);
    };
    speakNext(0);
  };

  const speakerColors = useMemo(() => {
    const colors = ["text-brand", "text-accent-purple", "text-success", "text-warning"];
    const map = new Map<string, string>();
    let i = 0;
    for (const line of dialogue) {
      if (!map.has(line.speaker)) {
        map.set(line.speaker, colors[i % colors.length]!);
        i += 1;
      }
    }
    return map;
  }, [dialogue]);

  return (
    <div className="flex flex-col gap-5">
      <Card className="p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-warning/15 text-warning">
            <Mic2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-faint">Speaking practice</p>
            <h2 className="font-semibold">{prompt}</h2>
          </div>
        </div>
        {content?.tip ? (
          <p className="mt-3 rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm text-muted">
            💡 {content.tip}
          </p>
        ) : null}
        <p className="mt-3 text-xs leading-relaxed text-faint">
          Step 1: listen to each line. Step 2: pause and repeat it aloud, using
          the same stress and intonation. Step 3: try the full dialogue in the
          role of both speakers. (Voice recognition is planned for a future
          version.)
        </p>
      </Card>

      <Card className="p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-faint">Dialogue</h3>
          {dialogue.length > 0 ? (
            <Button size="sm" variant="outline" onClick={playAll}>
              <Volume2 className="h-4 w-4" /> Play all
            </Button>
          ) : null}
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {dialogue.map((line, i) => (
            <div key={i} className="flex items-start gap-3">
              <button
                onClick={() => speak(line.text, i)}
                aria-label={`Play ${line.speaker}'s line`}
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
                  playing === i
                    ? "border-warning bg-warning/20 text-warning"
                    : "border-line text-muted hover:border-warning/50 hover:text-warning"
                }`}
              >
                <Volume2 className="h-4 w-4" />
              </button>
              <div className="min-w-0 flex-1 rounded-2xl border border-line bg-surface-2/70 p-3.5">
                <p className={`text-xs font-bold uppercase tracking-wider ${speakerColors.get(line.speaker) ?? "text-muted"}`}>
                  {line.speaker}
                </p>
                <p className="mt-1 leading-relaxed">{line.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {content?.expressions && content.expressions.length > 0 ? (
        <Card className="p-5 sm:p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-faint">Useful expressions</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {content.expressions.map((e, i) => (
              <button
                key={i}
                onClick={() => speak(e, -1)}
                className="rounded-full border border-line bg-surface-2 px-3 py-1.5 text-sm text-muted transition hover:border-brand hover:text-brand"
              >
                {e}
              </button>
            ))}
          </div>
        </Card>
      ) : null}

      <a href={backHref} className="btn btn-ghost self-start">
        ← Back to lesson
      </a>
    </div>
  );
}
