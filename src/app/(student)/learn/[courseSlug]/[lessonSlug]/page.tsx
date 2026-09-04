import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Headphones,
  Lock,
  PenLine,
  PlayCircle,
  SpellCheck,
  Target,
  Trophy,
} from "lucide-react";
import { getLessonContent, getTopicGrammar } from "@/lib/services/content.service";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  getLessonProgressRow,
  getLessonUnlocked,
  setCurrentLevel,
} from "@/lib/services/progress.service";
import { Markdown } from "@/components/ui/markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Banner } from "@/components/ui/banner";
import { FlashcardDeck } from "@/components/vocabulary/flashcards";
import { LessonViewTracker } from "./lesson-view-tracker";
import { BookmarkButton } from "./bookmark-button";
import { NotesCard } from "./notes-card";

export const metadata: Metadata = { title: "Lesson" };

type LessonWithNav = NonNullable<
  Awaited<ReturnType<typeof getLessonContent>>
>;

function buildNav(lesson: LessonWithNav) {
  const flat: {
    lessonId: string;
    lessonTitle: string;
    lessonSlug: string;
    courseSlug: string;
    topicId: string;
    topicTitle: string;
    lessonOrder: number;
  }[] = [];
  for (const topic of lesson.topic.course.topics) {
    for (const l of topic.lessons) {
      flat.push({
        lessonId: l.id,
        lessonTitle: l.title,
        lessonSlug: l.slug,
        courseSlug: lesson.topic.course.slug,
        topicId: topic.id,
        topicTitle: topic.title,
        lessonOrder: l.order,
      });
    }
  }
  return flat;
}

export default async function LearnPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = await params;
  const user = await getSessionUser();
  if (!user) notFound(); // protected by layout

  const lesson = await getLessonContent(courseSlug, lessonSlug);
  if (!lesson) notFound();

  const level = lesson.topic.course.level;
  const topic = lesson.topic;

  const [grammar, progressRow, unlock, quizAttempt, listeningAttempt, note, bookmarked] =
    await Promise.all([
      getTopicGrammar(topic.id),
      getLessonProgressRow(user.id, lesson.id),
      getLessonUnlocked(user.id, {
        levelId: level.id,
        courseId: topic.course.id,
        topicId: topic.id,
        topicOrder: topic.order,
      }),
      lesson.quiz[0]
        ? db.quizAttempt.findFirst({
            where: { userId: user.id, quizId: lesson.quiz[0].id, passed: true },
          })
        : Promise.resolve(null),
      lesson.listening[0]
        ? db.listeningAttempt.findFirst({
            where: {
              userId: user.id,
              listeningExerciseId: lesson.listening[0].id,
              passed: true,
            },
          })
        : Promise.resolve(null),
      db.note.findFirst({ where: { userId: user.id, lessonId: lesson.id } }),
      db.bookmark.findUnique({
        where: {
          userId_targetKind_targetId: {
            userId: user.id,
            targetKind: "LESSON",
            targetId: lesson.id,
          },
        },
      }),
    ]);

  // Remember which level the student is in
  if (user.currentLevelId !== level.id) {
    await setCurrentLevel(user.id, level.id);
  }

  const flat = buildNav(lesson);
  const currentIdx = flat.findIndex((f) => f.lessonId === lesson.id);
  const prev = currentIdx > 0 ? flat[currentIdx - 1] : null;
  const next =
    currentIdx >= 0 && currentIdx < flat.length - 1
      ? flat[currentIdx + 1]
      : null;

  const readingDone = Boolean(progressRow?.readingCompleted);
  const listeningDone = Boolean(progressRow?.listeningCompleted);
  const quizDone = Boolean(progressRow?.quizCompleted);
  const lessonCompleted = Boolean(progressRow?.completed);

  const quiz = lesson.quiz[0];
  const listening = lesson.listening[0];
  const readingExercise = lesson.reading[0];
  const writingExercise = lesson.exercises.find((e) => e.kind === "WRITING");
  const speakingExercise = lesson.exercises.find((e) => e.kind === "SPEAKING");

  const learnPath = `/learn/${courseSlug}/${lessonSlug}`;

  const lockedReasons = unlock.unlocked ? [] : unlock.reason === "level"
    ? [`Level ${level.levelNumber} (${level.label}) is still locked.`]
    : ["Finish the previous topic first to unlock this one."];

  const checklist: {
    label: string;
    done: boolean;
    href?: string;
    icon: typeof BookOpen;
    disabled?: boolean;
  }[] = [
    {
      label: "Read the lesson",
      done: readingDone,
      icon: BookOpen,
    },
    {
      label: "Pass the listening exercise (70%)",
      done: listeningDone,
      href: listening ? `/listening/${listening.id}?back=${encodeURIComponent(learnPath)}` : undefined,
      icon: Headphones,
    },
    {
      label: "Pass the lesson quiz (70%)",
      done: quizDone,
      href: quiz ? `/quiz/${quiz.id}?back=${encodeURIComponent(learnPath)}` : undefined,
      icon: Trophy,
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr_290px]">
      {/* Course navigation */}
      <aside className="order-2 hidden lg:block">
        <div className="sticky top-24 flex max-h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="border-b border-line px-4 py-3">
            <Link href={`/courses/${courseSlug}`} className="text-sm font-bold text-ink hover:text-brand">
              {topic.course.title}
            </Link>
            <p className="text-xs text-faint">Level {level.levelNumber} · {level.label}</p>
          </div>
          <nav className="flex-1 overflow-y-auto p-2" aria-label="Lessons">
            {topic.course.topics.map((t) => (
              <div key={t.id} className="mb-1">
                <p className="px-2 py-1.5 text-[0.68rem] font-bold uppercase tracking-wider text-faint">
                  {t.order + 1}. {t.title}
                </p>
                <ul className="flex flex-col gap-0.5">
                  {t.lessons.map((l) => {
                    const active = l.id === lesson.id;
                    return (
                      <li key={l.id}>
                        <Link
                          href={`/learn/${courseSlug}/${l.slug}`}
                          aria-current={active ? "page" : undefined}
                          className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-[0.82rem] transition ${
                            active
                              ? "bg-brand-soft font-semibold text-brand"
                              : "text-muted hover:bg-surface-2 hover:text-ink"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${active ? "bg-brand" : "bg-faint"}`} />
                          <span className="truncate">{l.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <article className="order-1 min-w-0 lg:order-none">
        <LessonViewTracker lessonId={lesson.id} alreadyViewed={readingDone} />

        {lessonCompleted ? (
          <div className="mb-5">
            <Banner tone="success">🎉 Lesson completed — great work!</Banner>
          </div>
        ) : null}

        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs text-faint">
          <Link href="/levels" className="hover:text-brand">Levels</Link>
          <span>/</span>
          <Link href={`/levels/${level.slug}`} className="hover:text-brand">Level {level.levelNumber}</Link>
          <span>/</span>
          <Link href={`/courses/${courseSlug}`} className="hover:text-brand">{topic.course.title}</Link>
        </nav>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="cyan">Topic {topic.order + 1} of {topic.course.topics.length}</Badge>
              <Badge>{topic.title}</Badge>
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{lesson.title}</h1>
            {lesson.summary ? <p className="mt-2 text-muted">{lesson.summary}</p> : null}
          </div>
          <BookmarkButton
            targetKind="LESSON"
            targetId={lesson.id}
            lessonPath={learnPath}
            initial={Boolean(bookmarked)}
          />
        </div>

        <div className="card mt-5 p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Target className="h-4 w-4 text-brand" /> Learning objectives
          </h2>
          <ul className="mt-3 flex flex-col gap-1.5">
            {(lesson.objectives as string[]).map((o, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success/80" />
                {o}
              </li>
            ))}
          </ul>
        </div>

        <div className="card mt-5 p-5 sm:p-6">
          <Markdown content={lesson.content} />
        </div>

        {/* Grammar */}
        {grammar.length > 0 ? (
          <div className="mt-6">
            <h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
              <SpellCheck className="h-5 w-5 text-accent-purple" /> Grammar focus
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              {grammar.map((g) => (
                <Card key={g.id} className="overflow-hidden">
                  <CardHeader className="border-b border-line bg-gradient-to-r from-accent-purple/10 to-transparent">
                    <CardTitle>{g.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 pt-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-faint">The rule</p>
                      <p className="mt-1 text-sm leading-relaxed">{g.explanation}</p>
                    </div>
                    <div className="rounded-xl border border-line bg-surface-2 p-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-faint">Structure</p>
                      <p className="mt-1 font-mono text-sm text-accent-cyan">{g.structure}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-faint">Examples</p>
                      <ul className="mt-1 flex flex-col gap-1">
                        {(g.examples as string[]).map((e, i) => (
                          <li key={i} className="text-sm text-muted">• {e}</li>
                        ))}
                      </ul>
                    </div>
                    {(g.businessExamples as string[]).length > 0 ? (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-faint">In business</p>
                        <ul className="mt-1 flex flex-col gap-1">
                          {(g.businessExamples as string[]).map((e, i) => (
                            <li key={i} className="text-sm text-success">✓ {e}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {(g.commonMistakes as string[]).length > 0 ? (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-faint">Common mistakes</p>
                        <ul className="mt-1 flex flex-col gap-1">
                          {(g.commonMistakes as string[]).map((e, i) => (
                            <li key={i} className="text-sm text-danger">✗ {e}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : null}

        {/* Vocabulary + flashcards */}
        {lesson.vocabulary.length > 0 ? (
          <div className="mt-6">
            <h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
              <SpellCheck className="h-5 w-5 text-brand" /> Vocabulary
              <span className="text-sm font-normal text-faint">
                {lesson.vocabulary.length} words
              </span>
            </h2>
            <FlashcardDeck
              items={lesson.vocabulary.map((v) => ({
                word: v.word,
                pronunciation: v.pronunciation,
                partOfSpeech: v.partOfSpeech,
                thaiMeaning: v.thaiMeaning,
                meaning: v.meaning,
                example: v.example,
                businessExample: v.businessExample,
              }))}
            />
          </div>
        ) : null}

        {/* Exercise tiles */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <PracticeTile
            title="Listening"
            subtitle={listening ? `${listening._count.questions} questions · 70% to pass` : "Coming soon"}
            icon={Headphones}
            tone="cyan"
            href={listening ? `/listening/${listening.id}?back=${encodeURIComponent(learnPath)}` : undefined}
            done={listeningDone}
          />
          <PracticeTile
            title="Quiz"
            subtitle={quiz ? `${quiz._count.questions} questions · ${quiz.passingScore}% to pass` : "Coming soon"}
            icon={Trophy}
            tone="purple"
            href={quiz ? `/quiz/${quiz.id}?back=${encodeURIComponent(learnPath)}` : undefined}
            done={quizDone}
          />
          {readingExercise ? (
            <PracticeTile
              title="Reading"
              subtitle="Business reading comprehension"
              icon={BookOpen}
              tone="brand"
              href={`/exercises/${readingExercise.id}?kind=reading&back=${encodeURIComponent(learnPath)}`}
            />
          ) : null}
        </div>

        {(writingExercise || speakingExercise) && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {writingExercise ? (
              <PracticeTile
                title="Writing practice"
                subtitle="Write a short business text"
                icon={PenLine}
                tone="green"
                href={`/exercises/${writingExercise.id}?back=${encodeURIComponent(learnPath)}`}
              />
            ) : null}
            {speakingExercise ? (
              <PracticeTile
                title="Speaking practice"
                subtitle="Read the dialogue aloud"
                icon={PlayCircle}
                tone="amber"
                href={`/exercises/${speakingExercise.id}?back=${encodeURIComponent(learnPath)}`}
              />
            ) : null}
          </div>
        )}

        {/* Prev / next */}
        <nav className="mt-8 flex items-center justify-between gap-3">
          {prev ? (
            <Link href={`/learn/${prev.courseSlug}/${prev.lessonSlug}`} className="btn btn-outline">
              <ArrowLeft className="h-4 w-4" /> Previous
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/learn/${next.courseSlug}/${next.lessonSlug}`} className="btn btn-primary">
              Next lesson <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link href={`/courses/${courseSlug}`} className="btn btn-primary">
              Finish course <CheckCircle2 className="h-4 w-4" />
            </Link>
          )}
        </nav>
      </article>

      {/* Right sidebar: checklist + notes */}
      <aside className="order-3 lg:order-none">
        <div className="flex flex-col gap-5 lg:sticky lg:top-24">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-brand" /> Lesson progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lockedReasons.length > 0 ? (
                <Banner tone="warning">
                  <Lock className="mr-1 inline h-3.5 w-3.5" /> {lockedReasons[0]}
                </Banner>
              ) : (
                <ul className="flex flex-col gap-2.5">
                  {checklist.map((item) => {
                    const inner = (
                      <>
                        {item.done ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                        ) : (
                          <Circle className="h-4 w-4 shrink-0 text-faint" />
                        )}
                        <span className={item.done ? "text-muted line-through" : ""}>{item.label}</span>
                      </>
                    );
                    return (
                      <li key={item.label}>
                        {item.href && !item.disabled ? (
                          <Link
                            href={item.href}
                            className="flex items-center gap-2.5 text-sm hover:text-brand"
                          >
                            {inner}
                          </Link>
                        ) : (
                          <span className="flex items-center gap-2.5 text-sm">{inner}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          <NotesCard
            lessonId={lesson.id}
            lessonPath={learnPath}
            initialNote={note?.content}
          />

          {quizAttempt && listeningAttempt ? (
            <Card>
              <CardContent className="flex items-center gap-3 py-4 text-sm">
                <Trophy className="h-5 w-5 text-warning" />
                <span className="text-muted">
                  You passed both the listening and the quiz —{" "}
                  <span className="font-semibold text-ink">lesson complete!</span>
                </span>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

function PracticeTile({
  title,
  subtitle,
  icon: Icon,
  tone,
  href,
  done,
}: {
  title: string;
  subtitle: string;
  icon: typeof BookOpen;
  tone: "brand" | "green" | "amber" | "purple" | "cyan";
  href?: string;
  done?: boolean;
}) {
  const toneClass = {
    brand: "text-brand",
    green: "text-success",
    amber: "text-warning",
    purple: "text-accent-purple",
    cyan: "text-accent-cyan",
  }[tone];

  const content = (
    <Card className="card-hover h-full p-4">
      <div className="flex items-start justify-between">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-surface-2 ${toneClass}`}>
          <Icon className="h-4.5 w-4.5" />
        </span>
        {done ? <CheckCircle2 className="h-4 w-4 text-success" /> : null}
      </div>
      <h3 className="mt-3 font-bold">{title}</h3>
      <p className="mt-0.5 text-xs text-muted">{subtitle}</p>
    </Card>
  );
  return href ? <Link href={href} className="block">{content}</Link> : content;
}
