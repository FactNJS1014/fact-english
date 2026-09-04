// ===========================================================================
// FactBusiness English — database seed
// Builds the full demo catalogue from authored atoms:
//   • seed-level1.ts  — Level 1 topics (situation, dialogue, expressions, vocab)
//   • seed-levels.ts  — Levels 2–5 topics (note + course dialogue)
//   • seed-grammar.ts — 40 grammar entries (one per course) + a quiz item each
//   • seed-vocab.ts   — Levels 2–5 vocab banks (6 words per course)
//   • seed-works.ts   — 40 writing tasks (one per course)
// Listening (5 Qs), quiz (~17–20 Qs), reading (4 Qs) are composed per topic
// from the topic's own authored sentences/vocabulary — every question is
// answerable from the lesson's real content.
//
// Usage: npm run db:seed   (resets the DB to a fresh demo state)
// ===========================================================================

import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { level1 } from "./seed-level1";
import { level2, level3, level4, level5 } from "./seed-levels";
import { grammarByLevel, type GrammarBank } from "./seed-grammar";
import { vocabByLevel, type VocabTuple } from "./seed-vocab";
import { writingByLevel, type WritingTask } from "./seed-works";
import { applyLessonComponentTx } from "../src/lib/services/progress.service";
import { awardAchievementsTx } from "../src/lib/services/gamification.service";

const db = new PrismaClient();

// ------------------------------------------------------------------ helpers

const STOP = new Set(
  (
    "a an the and or but if so of to for with on at in by from as is are was were be been being am do does did " +
    "have has had having not no nor i you he she it we they them his her its our your my me us this that these those " +
    "there here what who whom whose which when where why how can could will would shall should may might must " +
    "about after before between during into over under up down out off again once then than so very just also " +
    "only more most less least own same such some any all both each few other another because while still " +
    "too really quite well yes ok okay please thank thanks hi hello"
  ).split(/\s+/)
);

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function pickN<T>(arr: T[], n: number, exclude?: Set<T>): T[] {
  const pool = exclude ? arr.filter((x) => !exclude.has(x)) : [...arr];
  return shuffle(pool).slice(0, n);
}

function words(text: string): string[] {
  return text.replace(/[^a-zA-Z'-]+/g, " ").split(" ").filter(Boolean);
}

/** Last meaningful word of a sentence — used to build word-level tasks. */
function lastContentToken(sentence: string): string | null {
  const tokens = words(sentence).filter(
    (t) => t.length >= 3 && !STOP.has(t.toLowerCase())
  );
  const last = tokens[tokens.length - 1];
  return last ? last.replace(/['-]+$/, "") : null;
}

/** Replace the last content word with the given token. */
function replaceLastToken(sentence: string, replacement: string): string {
  const tokens = sentence.split(/(\s+)/);
  let i = tokens.length - 1;
  for (; i >= 0; i--) {
    const clean = (tokens[i] ?? "").replace(/[^a-zA-Z'-]/g, "");
    if (clean.length >= 3 && !STOP.has(clean.toLowerCase())) break;
  }
  if (i < 0) return sentence;
  const lead = (tokens[i] ?? "").replace(/[a-zA-Z'-]+/g, "");
  tokens[i] = replacement + lead;
  return tokens.join("");
}

/** First significant keyword of the sentence set that is NOT in `exclude`. */
function keywordFrom(
  sentences: string[],
  exclude?: Set<string>
): { word: string; sentence: string } | null {
  const counts = new Map<string, number>();
  const where = new Map<string, string>();
  for (const s of sentences) {
    for (const raw of words(s)) {
      const w = raw.toLowerCase();
      if (w.length < 4 || STOP.has(w)) continue;
      if (exclude?.has(raw)) continue;
      counts.set(w, (counts.get(w) ?? 0) + 1);
      if (!where.has(w)) where.set(w, s);
    }
  }
  const candidates = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .map(([w]) => w);
  if (candidates.length === 0) return null;
  const word = candidates[0]!;
  return { word, sentence: where.get(word)! };
}

/** Split text into real sentences (keeps abbreviations short enough). */
function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim().replace(/\s+/g, " "))
    .filter((s) => words(s).length >= 4);
}

// ------------------------------------------------------------------ data model

interface Line {
  speaker: string;
  text: string;
}

interface TopicAtom {
  title: string;
  desc: string;
  situation: string | null;
  note: string | null;
  dialogue: Line[];
  expressions: string[];
  vocab: VocabTuple[];
}

interface CourseAtom {
  title: string;
  short: string;
  desc: string;
  topics: TopicAtom[];
}

type L1CourseLike = {
  title: string;
  short: string;
  desc: string;
  topics: {
    title: string;
    desc: string;
    situation: string;
    dialogue: Line[];
    expressions: string[];
    vocab: VocabTuple[];
  }[];
};

type AtomCourseLike = {
  title: string;
  short: string;
  desc: string;
  dialogue: Line[];
  topics: { title: string; desc: string; note: string }[];
};

function adaptL1(course: L1CourseLike): CourseAtom {
  return {
    title: course.title,
    short: course.short,
    desc: course.desc,
    topics: course.topics.map((t) => ({
      title: t.title,
      desc: t.desc,
      situation: t.situation,
      note: null,
      dialogue: t.dialogue,
      expressions: t.expressions,
      vocab: t.vocab,
    })),
  };
}

function adaptAtom(course: AtomCourseLike): CourseAtom {
  return {
    title: course.title,
    short: course.short,
    desc: course.desc,
    topics: course.topics.map((t) => ({
      title: t.title,
      desc: t.desc,
      situation: null,
      note: t.note,
      dialogue: course.dialogue,
      expressions: [],
      vocab: [],
    })),
  };
}

const LEVELS: {
  levelNumber: number;
  data: { name: string; label: string; slug: string; description: string; courses: unknown[] };
  adapt: (c: never) => CourseAtom;
}[] = [
  { levelNumber: 1, data: level1, adapt: adaptL1 as never },
  { levelNumber: 2, data: level2, adapt: adaptAtom as never },
  { levelNumber: 3, data: level3, adapt: adaptAtom as never },
  { levelNumber: 4, data: level4, adapt: adaptAtom as never },
  { levelNumber: 5, data: level5, adapt: adaptAtom as never },
];

const DIFFICULTY: Record<number, string> = {
  1: "BASIC",
  2: "ELEMENTARY",
  3: "INTERMEDIATE",
  4: "UPPER_INTERMEDIATE",
  5: "ADVANCED",
};

/** Sentence corpus for a topic + whether it is a conversation (speakers). */
interface Corpus {
  label: string; // "conversation" | "update"
  sentences: { speaker: string | null; text: string }[];
  text: string; // plain joined text for listening transcript / reading passage
}

function buildCorpus(topic: TopicAtom, course: CourseAtom): Corpus {
  if (topic.situation && topic.dialogue.length > 0) {
    const lines = topic.dialogue.map((l) => ({ speaker: l.speaker, text: l.text }));
    const intro = topic.situation.trim();
    return {
      label: "conversation",
      sentences: [{ speaker: null, text: intro }, ...lines],
      text: [intro, ...topic.dialogue.map((l) => `${l.speaker}: ${l.text}`)].join("\n"),
    };
  }
  // Levels 2–5: a spoken "update" built from the topic's own authored prose.
  const raw = [topic.desc, topic.note].filter(Boolean).join(" ");
  const parts = splitSentences(raw);
  const body = parts.length >= 2 ? parts : splitSentences(`${course.desc} ${raw}`);
  const sentences = body.map((s) => ({ speaker: null, text: s }));
  return { label: "update", sentences, text: body.join(" ") };
}

// ------------------------------------------------------------------ practice builders

interface BaseQ {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

function corpusSentences(c: Corpus): string[] {
  return c.sentences.map((s) => s.text).filter((t) => words(t).length >= 3);
}

function mentionsTf(
  c: Corpus,
  makeFalse: boolean,
  used: Set<string>
): BaseQ | null {
  const sentences = corpusSentences(c);
  if (makeFalse) {
    const pool = vocabByLevel
      ? Object.values(vocabByLevel).flat(2).map((v) => v[0])
      : [];
    const fillers = [
      "accountant", "warehouse", "headquarters", "brochure", "laptop", "receptionist",
      "invoice", "brochure", "timesheet", "newsletter", "payroll", "keyboard", "cafeteria",
    ];
    const absent = shuffle([...fillers, ...pool]).find(
      (f) => !sentences.some((s) => s.toLowerCase().includes(f.toLowerCase()))
    );
    if (!absent) return null;
    return {
      question: `True or false? In the ${c.label}, the speaker mentions "${absent}".`,
      options: ["True", "False"],
      answer: "False",
      explanation: `The word "${absent}" does not appear in the ${c.label}.`,
    };
  }
  const kw = keywordFrom(sentences, new Set([...used]));
  if (!kw) return null;
  used.add(kw.word);
  return {
    question: `True or false? In the ${c.label}, the speaker mentions "${kw.word}".`,
    options: ["True", "False"],
    answer: "True",
    explanation: `The speaker really says: "${kw.sentence}"`,
  };
}

function blankListeningQ(c: Corpus, usedLines: Set<string>): BaseQ | null {
  for (const s of shuffle(c.sentences)) {
    if (usedLines.has(s.text)) continue;
    const token = lastContentToken(s.text);
    if (!token) continue;
    usedLines.add(s.text);
    const stem = replaceLastToken(s.text, "____");
    return {
      question: `Complete the sentence you hear: "${stem}"`,
      options: [],
      answer: token,
      explanation: `You heard: "${s.text}". The missing word is "${token}".`,
    };
  }
  return null;
}

function whichSentenceQ(c: Corpus, usedLines: Set<string>): BaseQ | null {
  const pool = c.sentences
    .filter((s) => !usedLines.has(s.text) && words(s.text).length >= 4)
    .map((s) => s.text);
  const correct = shuffle(pool)[0];
  if (!correct) return null;
  usedLines.add(correct);
  const distractors: string[] = [];
  for (const s of shuffle(pool)) {
    if (s === correct || distractors.length >= 3) break;
    const token = lastContentToken(s);
    if (!token) continue;
    distractors.push(replaceLastToken(s, token.toUpperCase()));
  }
  while (distractors.length < 3) distractors.push(`${correct.toUpperCase()}!!`);
  return {
    question: `Which sentence is said in the ${c.label}?`,
    options: shuffle([correct, ...distractors.slice(0, 3)]),
    answer: correct,
    explanation: `The ${c.label} includes exactly: "${correct}"`,
  };
}

function compQ(topic: TopicAtom, siblings: string[]): BaseQ {
  return {
    question: `What is this ${topic.situation ? "conversation" : "update"} mainly about?`,
    options: shuffle([topic.title, ...pickN(siblings.filter((s) => s !== topic.title), 4)]),
    answer: topic.title,
    explanation: `This lesson is part of "${topic.title}" — the situation and language all come from that unit.`,
  };
}

function whoSaysQ(c: Corpus, usedLines: Set<string>): BaseQ | null {
  const lines = c.sentences.filter((s) => s.speaker && !usedLines.has(s.text) && words(s.text).length >= 4);
  const pick = shuffle(lines)[0];
  if (!pick || !pick.speaker) return null;
  usedLines.add(pick.text);
  const speakers = [...new Set(c.sentences.map((s) => s.speaker).filter(Boolean))];
  const extras = ["Client", "Manager", "Supplier", "Receptionist", "Team leader", "Customer", "Assistant", "Director"].filter(
    (r) => !speakers.includes(r)
  );
  const options = shuffle([pick.speaker, ...pickN(extras, Math.max(2, 4 - speakers.length))]);
  return {
    question: `Who says: "${pick.text}"`,
    options,
    answer: pick.speaker,
    explanation: `In the conversation, ${pick.speaker} says exactly: "${pick.text}"`,
  };
}

/** Per-topic listening questions (exactly 5). */
function buildListening(
  corpus: Corpus,
  topic: TopicAtom,
  siblings: string[]
): (BaseQ & { type: string })[] {
  const used = new Set<string>();
  const out: (BaseQ & { type: string })[] = [];
  const push = (q: BaseQ | null, type: string) => {
    if (q && out.length < 5) out.push({ ...q, type });
  };
  push(compQ(topic, siblings), "MULTIPLE_CHOICE");
  push(mentionsTf(corpus, false, used), "TRUE_FALSE");
  push(mentionsTf(corpus, true, used), "TRUE_FALSE");
  push(blankListeningQ(corpus, used), "FILL_BLANK");
  push(whichSentenceQ(corpus, used), "MULTIPLE_CHOICE");
  // keep exactly five — fall back to sentence-level items if any step was skipped
  let guard = 0;
  while (out.length < 5 && guard < 10) {
    guard += 1;
    push(mentionsTf(corpus, out.length % 2 === 0, used), "TRUE_FALSE");
    push(blankListeningQ(corpus, used), "FILL_BLANK");
    push(whichSentenceQ(corpus, used), "MULTIPLE_CHOICE");
  }
  return out;
}

/** Per-topic reading questions (4). */
function buildReadingQ(corpus: Corpus, topic: TopicAtom, siblings: string[]): BaseQ[] {
  const used = new Set<string>();
  const out: BaseQ[] = [];
  const push = (q: BaseQ | null) => q && out.push(q);
  push(compQ(topic, siblings));
  push(whoSaysQ(corpus, used));
  const mFalse = mentionsTf(corpus, true, used);
  push(mFalse);
  const mTrue = mentionsTf(corpus, false, used);
  push(mTrue);
  const blank = blankListeningQ(corpus, used);
  if (blank) {
    const opts = shuffle([
      blank.answer,
      ...pickN(corpusSentences(corpus).flatMap(words).filter((w) => w.length >= 4 && w !== blank.answer), 3),
    ]);
    push({
      question: `Complete the sentence from the text: "${blank.question.split(": \"")[1]?.replace(/"?$/, "")}"`,
      options: opts,
      answer: blank.answer,
      explanation: blank.explanation,
    });
  }
  let guard = 0;
  while (out.length < 4 && guard < 10) {
    guard += 1;
    push(mentionsTf(corpus, guard % 2 === 0, used));
  }
  return out.slice(0, 4);
}

/** Vocabulary practice item builders (multi choice). */
function vocabFillQ(word: VocabTuple): BaseQ | null {
  const [, , , , , business] = word;
  const idx = business.toLowerCase().indexOf(word[0].toLowerCase());
  if (idx === -1) return null;
  const sentence =
    business.slice(0, idx) + "____" + business.slice(idx + word[0].length);
  return {
    question: `Choose the word that completes the business sentence: "${sentence}"`,
    options: [],
    answer: word[0],
    explanation: `The complete sentence is: "${business}".`,
  };
}

function vocabDefQ(word: VocabTuple, pool: VocabTuple[]): BaseQ {
  const distractors = pickN(pool.filter((w) => w[0] !== word[0]), 3)
    .map((w) => w[0]);
  const options = shuffle([word[0], ...distractors]);
  return {
    question: `Which word best matches the meaning: "${word[3]}"?`,
    options,
    answer: word[0],
    explanation: `"${word[0]}" means: ${word[3]}`,
  };
}

/** Quiz question composition (L1 aims ~20, L2–5 ~17). */
function buildQuizQ(
  corpus: Corpus,
  topic: TopicAtom,
  siblings: string[],
  vocab: VocabTuple[],
  grammar: GrammarBank
): BaseQ[] {
  const used = new Set<string>();
  const out: BaseQ[] = [];
  const push = (q: BaseQ | null) => q && out.push(q);

  // vocabulary: completion + meaning
  const fillPool = shuffle(vocab).slice(0, topic.situation ? 7 : 6);
  for (const w of fillPool) {
    const q = vocabFillQ(w);
    if (!q) continue;
    q.options = shuffle([
      w[0],
      ...pickN(vocab.filter((x) => x[0] !== w[0]), 3).map((x) => x[0]),
    ]);
    push(q);
  }
  for (const w of shuffle(vocab).slice(0, topic.situation ? 7 : 5)) {
    const existing = new Set(out.filter((q) => q.answer === w[0]).map(() => ""));
    void existing;
    push(vocabDefQ(w, vocab));
  }

  // comprehension
  push(compQ(topic, siblings));
  push(mentionsTf(corpus, false, used));
  push(mentionsTf(corpus, true, used));
  push(whichSentenceQ(corpus, used));
  push(blankListeningQ(corpus, used));

  // grammar item from the course grammar bank
  const mcq = grammar.mcq;
  push({
    question: mcq.q,
    options: mcq.options,
    answer: mcq.answer,
    explanation: mcq.why,
  });

  // pad to a healthy length with more dialogue-grounded items
  let guard = 0;
  while (out.length < (topic.situation ? 20 : 17) && guard < 12) {
    guard += 1;
    push(mentionsTf(corpus, guard % 2 === 0, used));
    const who = whoSaysQ(corpus, used);
    push(who);
    push(whichSentenceQ(corpus, used));
  }
  return out;
}

function readingPassage(topic: TopicAtom, corpus: Corpus): string {
  if (topic.situation) {
    const header = `Business situation: ${topic.situation}\n\n`;
    const body = topic.dialogue.map((l) => `${l.speaker}: ${l.text}`).join("\n");
    return header + body;
  }
  return corpus.text;
}

function lessonContent(topic: TopicAtom): string {
  const parts: string[] = [];
  if (topic.situation) {
    parts.push("## Business Situation");
    parts.push(topic.situation);
  } else {
    parts.push("## Overview");
    parts.push(topic.desc);
  }
  if (topic.note) {
    parts.push("## Key Points");
    parts.push(topic.note);
  }
  if (topic.dialogue.length > 0) {
    parts.push("## Conversation");
    for (const line of topic.dialogue) {
      parts.push(`**${line.speaker}:** ${line.text}`);
    }
  }
  if (topic.expressions.length > 0) {
    parts.push("## Useful Expressions");
    for (const e of topic.expressions) parts.push(`- ${e}`);
  }
  return parts.join("\n\n");
}

function lessonObjectives(topic: TopicAtom, levelLabel: string): string[] {
  return [
    `Understand and use the key language of "${topic.title}".`,
    `Follow a ${levelLabel.toLowerCase()}-level business ${topic.situation ? "conversation" : "update"} on this topic.`,
    "Apply the vocabulary and grammar to a realistic workplace task.",
  ];
}

function speakingContent(
  course: CourseAtom,
  topic: TopicAtom
): {
  dialogue: Line[];
  expressions: string[];
  tip?: string;
} {
  const dialogue =
    topic.dialogue.length > 0 ? topic.dialogue : course.topics[0]?.dialogue ?? [];
  const expressions =
    topic.expressions.length > 0
      ? topic.expressions
      : dialogue
          .filter((l) => l.speaker !== "You")
          .slice(0, 3)
          .map((l) => l.text);
  return {
    dialogue,
    expressions: expressions.slice(0, 6),
    tip:
      "Speak at a natural pace and stress the key words. Pause after each line and repeat it twice before moving on.",
  };
}

// ------------------------------------------------------------------ main

async function main() {
  const started = Date.now();
  console.log("🌱 FactBusiness English seed starting…");

  // 1. reset everything (whole catalogue + users live under these roots)
  await db.$executeRawUnsafe(
    `TRUNCATE TABLE "User", "Level", "Achievement" CASCADE`
  );
  console.log("  • database reset");

  // 2. achievements
  const achievements: {
    code: string;
    title: string;
    description: string;
    icon: string;
    xp: number;
  }[] = [
    { code: "first-lesson", title: "First Lesson", description: "Complete your first lesson.", icon: "🎯", xp: 20 },
    { code: "lessons-10", title: "Ten Lessons", description: "Complete 10 lessons.", icon: "📚", xp: 60 },
    { code: "lessons-50", title: "Fifty Lessons", description: "Complete 50 lessons.", icon: "📚", xp: 300 },
    { code: "lessons-100", title: "Century Learner", description: "Complete 100 lessons.", icon: "🏅", xp: 600 },
    { code: "first-quiz", title: "Quiz Taker", description: "Submit your first quiz.", icon: "🧠", xp: 30 },
    { code: "perfect-quiz", title: "Perfect Score", description: "Score 100% on a quiz.", icon: "💯", xp: 50 },
    { code: "first-listening", title: "Active Listener", description: "Complete your first listening exercise.", icon: "🎧", xp: 30 },
    { code: "first-reading", title: "Bookworm", description: "Pass your first reading exercise.", icon: "📖", xp: 20 },
    { code: "first-course", title: "Course Finisher", description: "Complete an entire course.", icon: "🏆", xp: 150 },
    { code: "first-writing", title: "First Draft", description: "Save your first writing answer.", icon: "✍️", xp: 20 },
    { code: "streak-7", title: "One Week Strong", description: "Learn 7 days in a row.", icon: "🔥", xp: 80 },
    { code: "streak-30", title: "Unstoppable", description: "Learn 30 days in a row.", icon: "⚡", xp: 400 },
    { code: "level-1", title: "Basic Graduate", description: "Earn the Level 1 certificate.", icon: "🎓", xp: 250 },
    { code: "level-2", title: "Elementary Graduate", description: "Earn the Level 2 certificate.", icon: "🎓", xp: 350 },
    { code: "level-3", title: "Intermediate Graduate", description: "Earn the Level 3 certificate.", icon: "🎓", xp: 450 },
    { code: "level-4", title: "Upper Intermediate Graduate", description: "Earn the Level 4 certificate.", icon: "🎓", xp: 550 },
    { code: "level-5", title: "Advanced Graduate", description: "Earn the Level 5 certificate.", icon: "🎓", xp: 650 },
  ];
  await db.achievement.createMany({ data: achievements });
  console.log(`  • ${achievements.length} achievements`);

  // 3. levels → courses → topics → lessons → practice objects
  const counts = {
    levels: 0,
    courses: 0,
    topics: 0,
    lessons: 0,
    vocabulary: 0,
    grammar: 0,
    listening: 0,
    listeningQ: 0,
    quizzes: 0,
    quizQ: 0,
    reading: 0,
    exercises: 0,
  };

  for (const levelDef of LEVELS) {
    const lvl = levelDef.data as {
      name: string;
      label: string;
      slug: string;
      description: string;
      courses: unknown[];
    };
    const levelRow = await db.level.create({
      data: {
        name: lvl.name,
        label: lvl.label,
        slug: lvl.slug,
        description: lvl.description,
        levelNumber: levelDef.levelNumber,
        published: "PUBLISHED",
      },
    });
    counts.levels += 1;

    const grammarBanks: GrammarBank[] = grammarByLevel[levelDef.levelNumber - 1] ?? [];
    const writingTasks: WritingTask[] = writingByLevel[levelDef.levelNumber - 1] ?? [];
    const vocabBanks: VocabTuple[][] =
      levelDef.levelNumber === 1 ? [] : (vocabByLevel[levelDef.levelNumber] ?? []);

    for (const [ci, raw] of lvl.courses.entries()) {
      const course = levelDef.adapt(raw as never);
      const courseRow = await db.course.create({
        data: {
          levelId: levelRow.id,
          title: course.title,
          slug: slugify(course.title),
          shortDescription: course.short,
          description: course.desc,
          order: ci,
          published: "PUBLISHED",
        },
      });
      counts.courses += 1;

      const grammar: GrammarBank | undefined = grammarBanks[ci];
      const writing: WritingTask | undefined = writingTasks[ci];
      const courseVocab: VocabTuple[] = vocabBanks[ci] ?? [];
      const siblingTitles = course.topics.map((t) => t.title);
      const levelDifficulty = DIFFICULTY[levelDef.levelNumber] ?? "BASIC";

      for (const [ti, topic] of course.topics.entries()) {
        const topicRow = await db.topic.create({
          data: {
            courseId: courseRow.id,
            title: topic.title,
            slug: slugify(topic.title),
            description: topic.desc,
            order: ti,
            difficulty: levelDifficulty as Prisma.TopicCreateInput["difficulty"],
            published: "PUBLISHED",
          },
        });
        counts.topics += 1;

        const corpus = buildCorpus(topic, course);
        const vocab: VocabTuple[] =
          topic.vocab.length > 0 ? topic.vocab : courseVocab;
        const duration = Math.max(
          8,
          Math.min(25, Math.round(words(corpus.text).length / 14))
        );

        // lesson (one per topic)
        const lesson = await db.lesson.create({
          data: {
            topicId: topicRow.id,
            title: topic.title,
            slug: slugify(topic.title),
            content: lessonContent(topic),
            objectives: lessonObjectives(topic, levelDef.data.label),
            summary: topic.desc,
            order: 0,
            durationMinutes: duration,
            published: "PUBLISHED",
          },
        });
        counts.lessons += 1;

        // grammar
        if (grammar) {
          await db.grammar.create({
            data: {
              topicId: topicRow.id,
              title: grammar.title,
              explanation: grammar.explanation,
              structure: grammar.structure,
              examples: grammar.examples as Prisma.InputJsonValue,
              businessExamples: grammar.business as Prisma.InputJsonValue,
              commonMistakes: grammar.mistakes as Prisma.InputJsonValue,
            },
          });
          counts.grammar += 1;
        }

        // vocabulary
        if (vocab.length > 0) {
          const created = await db.vocabulary.createMany({
            data: vocab.map((v) => ({
              lessonId: lesson.id,
              word: v[0],
              partOfSpeech: v[1],
              thaiMeaning: v[2],
              meaning: v[3],
              example: v[4],
              businessExample: v[5],
            })),
          });
          counts.vocabulary += created.count;
        }

        // listening exercise + 5 questions
        const listening = await db.listeningExercise.create({
          data: {
            lessonId: lesson.id,
            title: `${topic.title} — Listening`,
            transcript: corpus.text,
            duration,
            published: "PUBLISHED",
          },
        });
        counts.listening += 1;
        const listeningQs = buildListening(corpus, topic, siblingTitles);
        const createdLq = await db.listeningQuestion.createMany({
          data: listeningQs.map((q, i) => ({
            listeningExerciseId: listening.id,
            question: q.question,
            type: q.type as Prisma.ListeningQuestionCreateInput["type"],
            options: q.options as Prisma.InputJsonValue,
            answer: q.answer,
            explanation: q.explanation,
            order: i,
            points: 20,
          })),
        });
        counts.listeningQ += createdLq.count;

        // quiz + questions + options
        const quiz = await db.quiz.create({
          data: {
            lessonId: lesson.id,
            title: `Quiz — ${topic.title}`,
            description: topic.desc,
            passingScore: 70,
            published: "PUBLISHED",
          },
        });
        counts.quizzes += 1;
        const quizQs = grammar
          ? buildQuizQ(corpus, topic, siblingTitles, vocab, grammar)
          : buildQuizQ(corpus, topic, siblingTitles, vocab, grammarByLevel[0]![0]!);
        const qRows: Prisma.QuizQuestionCreateManyInput[] = quizQs.map((q, i) => ({
          quizId: quiz.id,
          question: q.question,
          type:
            q.options.length === 0
              ? "FILL_BLANK"
              : q.options.length === 2 && q.options[0] === "True"
                ? "TRUE_FALSE"
                : "MULTIPLE_CHOICE",
          order: i,
          points: 5,
          explanation: q.explanation,
        }));
        const qc = await db.quizQuestion.createMany({ data: qRows });
        counts.quizQ += qc.count;
        const rows = await db.quizQuestion.findMany({
          where: { quizId: quiz.id },
          orderBy: { order: "asc" },
          select: { id: true },
        });
        const optionRows = rows.flatMap((row, i) => {
          const q = quizQs[i]!;
          const answer = q.answer;
          return (q.options.length > 0 ? q.options : [q.answer]).map((text, oi) => ({
            questionId: row.id,
            text,
            isCorrect: text === answer,
            order: oi,
          }));
        });
        await db.quizOption.createMany({ data: optionRows });

        // reading exercise
        const readingQs = buildReadingQ(corpus, topic, siblingTitles);
        const reading = await db.readingExercise.create({
          data: {
            lessonId: lesson.id,
            title: `${topic.title} — Reading`,
            passage: readingPassage(topic, corpus),
            questions: readingQs.map((q) => ({
              question: q.question,
              options: q.options.length ? q.options : [q.answer],
              answer: q.answer,
              explanation: q.explanation,
            })) as Prisma.InputJsonValue,
            order: 0,
            published: "PUBLISHED",
          },
        });
        void reading;
        counts.reading += 1;

        // writing + speaking exercises on the first lesson of each course
        if (ti === 0) {
          if (writing) {
            await db.exercise.create({
              data: {
                lessonId: lesson.id,
                kind: "WRITING",
                title: `${writing.title} — ${course.title}`,
                prompt: writing.prompt,
                content: {
                  modelAnswer: writing.model,
                  checklist: writing.checklist,
                } as Prisma.InputJsonValue,
                order: 0,
                published: "PUBLISHED",
              },
            });
            counts.exercises += 1;
          }
          const sp = speakingContent(course, topic);
          await db.exercise.create({
            data: {
              lessonId: lesson.id,
              kind: "SPEAKING",
              title: `Speaking — ${topic.title}`,
              prompt: `Practice this ${course.title.toLowerCase()} conversation aloud.`,
              content: {
                dialogue: sp.dialogue,
                expressions: sp.expressions,
                tip: sp.tip,
              } as unknown as Prisma.InputJsonValue,
              order: 1,
              published: "PUBLISHED",
            },
          });
          counts.exercises += 1;
        }
      }
    }
  }

  console.log("  • catalogue built", counts);

  // 4. demo accounts
  const adminPass = bcrypt.hashSync("Admin@12345", 10);
  const studentPass = bcrypt.hashSync("Student@12345", 10);
  const admin = await db.user.create({
    data: {
      firstName: "Admin",
      lastName: "FactBusiness",
      username: "admin",
      email: "admin@factbusiness.app",
      passwordHash: adminPass,
      role: "ADMIN",
    },
  });
  const student = await db.user.create({
    data: {
      firstName: "Napa",
      lastName: "Srisai",
      username: "student.demo",
      email: "student@factbusiness.app",
      passwordHash: studentPass,
      role: "STUDENT",
    },
  });
  console.log("  • demo users (admin / student.demo)");

  // 5. demo student progress — complete Level 1 course 1 and start course 2
  const l1 = await db.level.findUniqueOrThrow({ where: { slug: "basic" } });
  const l1Courses = await db.course.findMany({
    where: { levelId: l1.id },
    orderBy: { order: "asc" },
    include: {
      topics: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" }, include: { quiz: true, listening: true } } },
      },
    },
  });

  await db.$transaction(
    async (tx) => {
    let completedSoFar = 0;
    for (const course of l1Courses.slice(0, 2)) {
      const topics = course.topics;
      const takeCount = course.order === 0 ? topics.length : 1;
      for (const topic of topics.slice(0, takeCount)) {
        for (const lesson of topic.lessons) {
          const quiz = lesson.quiz[0];
          const listening = lesson.listening[0];
          if (quiz) {
            const totalQ = await tx.quizQuestion.count({ where: { quizId: quiz.id } });
            await tx.quizAttempt.create({
              data: {
                userId: student.id,
                quizId: quiz.id,
                score: Math.round(totalQ * 0.9),
                totalQuestions: totalQ,
                percentage: 90,
                passed: true,
              },
            });
            await applyLessonComponentTx(tx, student.id, lesson.id, "quiz");
          }
          if (listening) {
            await tx.listeningAttempt.create({
              data: {
                userId: student.id,
                listeningExerciseId: listening.id,
                score: 4,
                totalQuestions: 5,
                percentage: 80,
                passed: true,
              },
            });
            await applyLessonComponentTx(tx, student.id, lesson.id, "listening");
          }
          await applyLessonComponentTx(tx, student.id, lesson.id, "reading");
          completedSoFar += 1;
          if (completedSoFar >= 6) break;
        }
      }
    }
    await tx.user.update({
      where: { id: student.id },
      data: { currentLevelId: l1.id },
    });
    await awardAchievementsTx(tx, student.id);
    },
    { maxWait: 15000, timeout: 300000 }
  );

  // streak looks alive: activity yesterday as well
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  await db.learningActivity.create({
    data: { userId: student.id, kind: "LESSON", detail: "seed", activityDate: yesterday },
  });
  await db.user.update({ where: { id: student.id }, data: { lastLoginAt: new Date() } });
  void admin;

  const summary = await db.$transaction([
    db.level.count(),
    db.course.count(),
    db.topic.count(),
    db.lesson.count(),
    db.vocabulary.count(),
    db.grammar.count(),
    db.listeningQuestion.count(),
    db.quizQuestion.count(),
    db.quizOption.count(),
    db.readingExercise.count(),
    db.exercise.count(),
    db.user.count(),
  ]);
  console.log("✅ seed complete in", ((Date.now() - started) / 1000).toFixed(1) + "s");
  console.log("   levels:", summary[0], "| courses:", summary[1], "| topics:", summary[2], "| lessons:", summary[3]);
  console.log("   vocabulary:", summary[4], "| grammar:", summary[5], "| listening questions:", summary[6]);
  console.log("   quiz questions:", summary[7], "| quiz options:", summary[8], "| reading:", summary[9], "| exercises:", summary[10], "| users:", summary[11]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
