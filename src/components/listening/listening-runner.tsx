"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Headphones,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  XCircle,
} from "lucide-react";
import { submitListeningAction } from "@/lib/actions/learning.actions";
import type { ListeningRunnerQuestion } from "@/lib/services/listening.service";
import { Button } from "../ui/primitives";
import { Card } from "../ui/card";
import { ProgressBar } from "../ui/progress";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";

interface ExercisePayload {
  id: string;
  title: string;
  audioUrl: string | null;
  transcript: string;
  duration: number;
  questions: ListeningRunnerQuestion[];
}

type ReviewItem = {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string | null;
};

type Result = {
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  review: ReviewItem[];
};

const LETTERS = ["A", "B", "C", "D", "E", "F"];
const SPEEDS = [0.75, 1, 1.25, 1.5];

export function ListeningRunner({
  exercise,
  backHref,
}: {
  exercise: ExercisePayload;
  backHref: string;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const router = useRouter();

  const answeredCount = Object.keys(answers).length;
  const total = exercise.questions.length;

  const select = (qid: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [qid]: value }));

  const submit = async () => {
    if (answeredCount < total) {
      const ok = window.confirm(
        `${total - answeredCount} question${total - answeredCount === 1 ? "" : "s"} not answered. Submit anyway?`
      );
      if (!ok) return;
    }
    setBusy(true);
    setError(null);
    const res = await submitListeningAction(exercise.id, answers);
    setBusy(false);
    if (res.ok && res.result && res.result.ok) {
      setResult(res.result);
      if (res.result.passed) router.refresh();
    } else if (res.code === "UNAUTHENTICATED") {
      router.push("/login?expired=1");
    } else {
      setError(res.error ?? "Submission failed. Please try again.");
    }
  };

  const retry = () => {
    setAnswers({});
    setResult(null);
    setError(null);
  };

  return (
    <div className="flex flex-col gap-5">
      <AudioPlayer
        title={exercise.title}
        audioUrl={exercise.audioUrl}
        transcript={exercise.transcript}
      />

      {result ? (
        <div className="flex flex-col gap-5">
          <Card
            className={cn(
              "border-2 p-6 text-center",
              result.passed ? "border-success/40" : "border-danger/40"
            )}
          >
            <div
              className={cn(
                "mx-auto flex h-14 w-14 items-center justify-center rounded-full",
                result.passed ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
              )}
            >
              {result.passed ? (
                <CheckCircle2 className="h-7 w-7" />
              ) : (
                <XCircle className="h-7 w-7" />
              )}
            </div>
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-faint">
              Your score
            </p>
            <p className="mt-1 text-4xl font-black">{result.percentage}%</p>
            <p
              className={cn(
                "mt-2 inline-block rounded-full px-4 py-1 text-sm font-extrabold",
                result.passed ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
              )}
            >
              {result.passed ? "PASS" : "FAIL"} · pass mark 70%
            </p>
            <p className="mt-3 text-sm text-muted">
              Correct: {result.score} / {result.totalQuestions}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {!result.passed ? (
                <Button onClick={retry}>
                  <RotateCcw className="h-4 w-4" /> Try Again
                </Button>
              ) : null}
              <Button variant="outline" onClick={() => setShowTranscript((s) => !s)}>
                {showTranscript ? "Hide" : "Show"} transcript
              </Button>
              <a href={backHref} className="btn btn-outline">
                Back to lesson
              </a>
            </div>
            {showTranscript ? (
              <div className="mt-5 rounded-xl border border-line bg-surface-2 p-4 text-left text-sm leading-relaxed text-muted">
                {exercise.transcript}
              </div>
            ) : null}
          </Card>

          <div className="flex flex-col gap-3">
            {result.review.map((r, i) => (
              <Card key={r.questionId} className="p-4">
                <div className="flex items-start gap-3">
                  {r.isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-faint">Question {i + 1}</p>
                    <p className="mt-1 font-medium">{r.question}</p>
                    <p className="mt-1.5 text-sm">
                      <span className="text-faint">Your answer: </span>
                      <span className={r.isCorrect ? "text-success" : "text-danger"}>
                        {r.userAnswer || "—"}
                      </span>
                    </p>
                    {!r.isCorrect ? (
                      <p className="text-sm">
                        <span className="text-faint">Correct answer: </span>
                        <span className="font-semibold text-success">{r.correctAnswer}</span>
                      </p>
                    ) : null}
                    {r.explanation ? (
                      <p className="mt-2 text-xs leading-relaxed text-muted">
                        💡 {r.explanation}
                      </p>
                    ) : null}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <>
          <Card className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold">
                Questions <span className="text-sm font-normal text-faint">({answeredCount}/{total} answered)</span>
              </h2>
              <ProgressBar value={total ? (answeredCount / total) * 100 : 0} className="hidden w-32 sm:block" />
            </div>
            <div className="flex flex-col gap-5">
              {exercise.questions.map((q, qi) => (
                <fieldset key={q.id} className="rounded-2xl border border-line bg-surface-2/60 p-4">
                  <legend className="sr-only">Question {qi + 1}</legend>
                  <p className="flex items-start gap-2 font-medium leading-relaxed">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-xs font-bold text-brand">
                      {qi + 1}
                    </span>
                    {q.question}
                  </p>
                  {q.type === "FILL_BLANK" ? (
                    <input
                      className="input mt-3"
                      placeholder="Type what you hear…"
                      value={answers[q.id] ?? ""}
                      onChange={(e) => select(q.id, e.target.value)}
                    />
                  ) : (
                    <div className="mt-3 grid gap-2 sm:grid-cols-2" role="radiogroup">
                      {(q.options ?? []).map((option, oi) => {
                        const selected = answers[q.id] === option;
                        return (
                          <button
                            key={oi}
                            role="radio"
                            aria-checked={selected}
                            onClick={() => select(q.id, option)}
                            className={cn(
                              "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition",
                              selected
                                ? "border-accent-cyan bg-accent-cyan/10 text-ink"
                                : "border-line bg-surface text-muted hover:text-ink"
                            )}
                          >
                            <span className="font-bold text-faint">{LETTERS[oi]}</span>
                            <span className="truncate">{option}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </fieldset>
              ))}
            </div>
          </Card>

          {error ? (
            <p role="alert" className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end">
            <Button size="lg" onClick={submit} disabled={busy}>
              {busy ? <Spinner className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              SUBMIT ANSWERS
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ audio

function AudioPlayer({
  title,
  audioUrl,
  transcript,
}: {
  title: string;
  audioUrl: string | null;
  transcript: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [sentenceNo, setSentenceNo] = useState(0);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(0.9);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(0);
  const [speechVoicesReady, setSpeechVoicesReady] = useState(false);
  const sentenceIndex = useRef(0);

  const sentences = useMemo(
    () =>
      transcript
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean),
    [transcript]
  );
  const totalSeconds = useMemo(() => {
    if (audioUrl) return 0; // native element reports time
    const wpm = 150;
    return Math.round((transcript.split(/\s+/).length / wpm) * 60 * (1 / rate));
  }, [transcript, rate, audioUrl]);

  // native <audio>
  const nativeAudio = audioUrl !== null;

  useEffect(() => {
    if (!nativeAudio) {
      const load = () => setSpeechVoicesReady(true);
      window.speechSynthesis?.addEventListener("voiceschanged", load);
      load();
      return () =>
        window.speechSynthesis?.removeEventListener("voiceschanged", load);
    }
  }, [nativeAudio]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => {
      setTime(el.currentTime);
      setProgress(el.duration ? el.currentTime / el.duration : 0);
    };
    const onEnd = () => setPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnd);
    };
  }, [audioUrl]);

  const playTts = useCallback(
    (fromStart: boolean) => {
      if (!("speechSynthesis" in window)) return;
      if (!fromStart && window.speechSynthesis.speaking) {
        window.speechSynthesis.resume();
        setPlaying(true);
        return;
      }
      if (fromStart || !window.speechSynthesis.paused) {
        window.speechSynthesis.cancel();
        sentenceIndex.current = 0;
        setSentenceNo(0);
      }
      const speakSentence = (idx: number) => {
        const sentence = sentences[idx];
        if (!sentence) {
          setPlaying(false);
          return;
        }
        const u = new SpeechSynthesisUtterance(sentence);
        u.lang = "en-US";
        u.rate = rate;
        u.volume = volume;
        u.onend = () => {
          sentenceIndex.current += 1;
          setSentenceNo(sentenceIndex.current);
          speakSentence(sentenceIndex.current);
        };
        u.onerror = () => setPlaying(false);
        window.speechSynthesis.speak(u);
      };
      speakSentence(sentenceIndex.current);
      setPlaying(true);
    },
    [sentences, rate, volume]
  );

  const toggle = () => {
    if (nativeAudio) {
      const el = audioRef.current;
      if (!el) return;
      if (el.paused) {
        void el.play();
        setPlaying(true);
      } else {
        el.pause();
        setPlaying(false);
      }
      return;
    }
    if (playing) {
      window.speechSynthesis?.pause();
      setPlaying(false);
    } else {
      playTts(false);
    }
  };

  const replay = () => {
    if (nativeAudio) {
      const el = audioRef.current;
      if (el) {
        el.currentTime = 0;
        void el.play();
        setPlaying(true);
      }
      return;
    }
    playTts(true);
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };

  return (
    <Card className="overflow-hidden border-brand/20">
      <div className="flex items-center gap-4 border-b border-line bg-gradient-to-r from-brand-soft to-transparent px-5 py-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/25">
          <Headphones className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-bold">{title}</p>
          <p className="text-xs text-muted">
            {nativeAudio ? "Audio file" : "Text-to-speech · read by your browser"}
            {!nativeAudio && !speechVoicesReady ? " (loading voice…)" : ""}
          </p>
        </div>
      </div>

      <div className="p-5">
        <audio
          ref={audioRef}
          src={audioUrl ?? undefined}
          preload="metadata"
          className="hidden"
        />

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              disabled={!nativeAudio && !speechVoicesReady}
              aria-label={playing ? "Pause audio" : "Play audio"}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand to-accent-cyan text-white shadow-lg shadow-brand/30 transition hover:scale-105 disabled:opacity-40"
            >
              {playing ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
            </button>
            <button
              onClick={replay}
              disabled={!nativeAudio && !speechVoicesReady}
              aria-label="Replay from the beginning"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition hover:text-ink disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          <div className="min-w-0 flex-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand to-accent-cyan"
                style={{
                  width: nativeAudio ? `${progress * 100}%` : `${(sentenceNo / Math.max(sentences.length, 1)) * 100}%`,
                }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[0.7rem] text-faint">
              <span>
                {nativeAudio ? fmt(time) : `sentence ${Math.min(sentenceNo + 1, sentences.length)} / ${sentences.length}`}
              </span>
              <span>{nativeAudio ? "—" : `≈ ${fmt(totalSeconds)}`}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <Volume2 className="h-4 w-4 text-faint" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => {
                const v = Number(e.target.value);
                setVolume(v);
                if (nativeAudio && audioRef.current) audioRef.current.volume = v;
              }}
              aria-label="Volume"
              className="w-24 accent-[var(--brand)]"
            />
          </div>
          <div className="flex items-center gap-1" role="group" aria-label="Playback speed">
            <span className="mr-1 text-xs text-faint">Speed</span>
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setRate(s);
                  if (nativeAudio && audioRef.current) audioRef.current.playbackRate = s;
                  else if (playing) playTts(true);
                }}
                aria-pressed={rate === s}
                className={cn(
                  "rounded-lg px-2 py-1 text-xs font-bold transition",
                  rate === s ? "bg-brand-soft text-brand" : "text-faint hover:text-muted"
                )}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {!nativeAudio && (
          <p className="mt-3 text-[0.7rem] leading-relaxed text-faint">
            No audio file is attached to this exercise yet, so your browser reads
            the script aloud. When an admin adds an <code>audioUrl</code>, the
            built-in player is used instead.
          </p>
        )}
      </div>
    </Card>
  );
}
