import { describe, it } from "node:test";
import assert from "node:assert/strict";

// ----------------------------------------------------------------
// Parity helpers. The real scoring lives in src/lib/services/quiz.service.ts
// (normalizeAnswer + option.isCorrect), listening.service.ts and
// exercise.service.ts. These mirrors keep the exact same semantics so the
// seed + scoring contract is testable without a database:
//   • quiz  MC/TF   → compare selected option id, correct when isCorrect
//   • quiz  FILL    → normalizeAnswer(typed) === normalizeAnswer(canonical)
//   • listening/reading → normalizeAnswer(selected text) === normalizeAnswer(answer)
// ----------------------------------------------------------------

export function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

interface QuizOptionLike {
  id: string;
  text: string;
  isCorrect?: boolean;
}

interface QuizQuestionLike {
  id: string;
  type: string;
  options: QuizOptionLike[];
}

/** Mirrors submitQuiz() in src/lib/services/quiz.service.ts. */
export function scoreQuiz(
  questions: QuizQuestionLike[],
  answers: Record<string, string>
): { score: number; total: number; percentage: number; passed: boolean } {
  let score = 0;
  for (const q of questions) {
    const selected = (answers[q.id] ?? "").trim();
    let correct = false;
    if (q.type === "FILL_BLANK" || q.options.length === 0) {
      const canonical = q.options.find((o) => o.isCorrect);
      correct = Boolean(
        canonical && normalizeAnswer(selected) === normalizeAnswer(canonical.text)
      );
    } else {
      const chosen = q.options.find((o) => o.id === selected);
      correct = chosen?.isCorrect ?? false;
    }
    if (correct) score += 1;
  }
  const total = questions.length;
  const percentage = Math.round((score / total) * 100);
  return { score, total, percentage, passed: percentage >= 70 };
}

/** Mirrors listening/reading submission scoring (text vs canonical text). */
export function scoreTextAnswers(
  questions: { id: string; answer: string }[],
  answers: Record<string, string>
): number {
  let score = 0;
  for (const q of questions) {
    const selected = (answers[q.id] ?? "").trim();
    if (selected.length > 0 && normalizeAnswer(selected) === normalizeAnswer(q.answer)) {
      score += 1;
    }
  }
  return score;
}

describe("normalizeAnswer", () => {
  it("is case-insensitive, trimmed and whitespace-collapsed", () => {
    assert.equal(normalizeAnswer("  Meeting   ROOM  2 "), "meeting room 2");
    assert.equal(normalizeAnswer("TRUE"), "true");
    assert.equal(normalizeAnswer(""), "");
  });
});

describe("scoreQuiz (multiple choice / true-false)", () => {
  const questions: QuizQuestionLike[] = [
    { id: "q1", type: "MULTIPLE_CHOICE", options: [
      { id: "a", text: "9:00 AM" },
      { id: "b", text: "10:00 AM", isCorrect: true },
      { id: "c", text: "11:00 AM" },
    ] },
    { id: "q2", type: "TRUE_FALSE", options: [
      { id: "t", text: "True", isCorrect: false },
      { id: "f", text: "False", isCorrect: true },
    ] },
    { id: "q3", type: "MULTIPLE_CHOICE", options: [
      { id: "d", text: "negotiation", isCorrect: true },
      { id: "e", text: "delivery" },
      { id: "f", text: "deadline" },
    ] },
  ];

  it("scores 100% when everything is correct", () => {
    const res = scoreQuiz(questions, { q1: "b", q2: "f", q3: "d" });
    assert.equal(res.score, 3);
    assert.equal(res.percentage, 100);
    assert.equal(res.passed, true);
  });

  it("fails when only one of three is correct", () => {
    const res = scoreQuiz(questions, { q1: "a", q2: "t", q3: "d" });
    assert.equal(res.score, 1);
    assert.equal(res.percentage, 33);
    assert.equal(res.passed, false);
  });

  it("does not count an unanswered question as correct", () => {
    const res = scoreQuiz(questions, { q1: "b" });
    assert.equal(res.score, 1);
  });
});

describe("scoreQuiz (fill in the blank)", () => {
  const questions: QuizQuestionLike[] = [
    { id: "f1", type: "FILL_BLANK", options: [{ id: "o", text: "meeting", isCorrect: true }] },
  ];

  it("accepts the typed answer case-insensitively", () => {
    assert.equal(scoreQuiz(questions, { f1: "  MEETING " }).score, 1);
  });

  it("rejects a different typed answer", () => {
    assert.equal(scoreQuiz(questions, { f1: "break" }).score, 0);
  });
});

describe("scoreTextAnswers (listening / reading text answers)", () => {
  const questions = [
    { id: "l1", answer: "True" },
    { id: "l2", answer: "warehouse" },
  ];

  it("counts normalized matches", () => {
    assert.equal(scoreTextAnswers(questions, { l1: "true", l2: "  Warehouse " }), 2);
  });

  it("ignores empty submissions", () => {
    assert.equal(scoreTextAnswers(questions, { l1: "true" }), 1);
  });
});
