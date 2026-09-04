import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Layers, Type, BookMarked } from "lucide-react";
import { searchContent } from "@/lib/services/content.service";
import { SearchBox } from "@/components/ui/search-box";
import { EmptyState } from "@/components/ui/empty";

export const metadata: Metadata = { title: "Search" };

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: typeof BookOpen;
  children: React.ReactNode;
}) {
  return (
    <h2 className="mb-3 mt-8 flex items-center gap-2 text-lg font-bold">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand">
        <Icon className="h-4 w-4" />
      </span>
      {children}
    </h2>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = q ? await searchContent(q) : null;
  const total =
    results
      ? results.courses.length +
        results.topics.length +
        results.lessons.length +
        results.vocabulary.length +
        results.grammar.length
      : 0;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Search</h1>
      <p className="mt-2 text-muted">
        Find courses, topics, lessons, vocabulary and grammar across all levels.
      </p>
      <SearchBox initial={q} className="mt-5 w-full" placeholder="e.g. meeting, negotiation, invoice…" />

      {!q ? (
        <div className="mt-10">
          <EmptyState title="Type something to search" description="Try words like meeting, email, salary, presentation or deadline." />
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-faint">
            {total} result{total === 1 ? "" : "s"} for “{q}”
          </p>

          {results && results.lessons.length > 0 && (
            <>
              <SectionTitle icon={GraduationCap}>Lessons</SectionTitle>
              <div className="flex flex-col gap-2">
                {results.lessons.map((l) => (
                  <Link key={l.id} href={`/learn/${l.topic.course.slug}/${l.slug}`} className="card card-hover flex items-center gap-3 px-4 py-3">
                    <div className="flex-1">
                      <p className="font-semibold">{l.title}</p>
                      <p className="text-xs text-faint">
                        {l.topic.course.title}
                        {l.summary ? ` — ${l.summary.slice(0, 90)}…` : ""}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-faint" />
                  </Link>
                ))}
              </div>
            </>
          )}

          {results && results.courses.length > 0 && (
            <>
              <SectionTitle icon={BookOpen}>Courses</SectionTitle>
              <div className="flex flex-col gap-2">
                {results.courses.map((c) => (
                  <Link key={c.id} href={`/courses/${c.slug}`} className="card card-hover flex items-center gap-3 px-4 py-3">
                    <div className="flex-1">
                      <p className="font-semibold">{c.title}</p>
                      <p className="text-xs text-faint">
                        Level {c.level.levelNumber} · {c.shortDescription.slice(0, 90)}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-faint" />
                  </Link>
                ))}
              </div>
            </>
          )}

          {results && results.topics.length > 0 && (
            <>
              <SectionTitle icon={Layers}>Topics</SectionTitle>
              <div className="flex flex-col gap-2">
                {results.topics.map((t) => (
                  <Link key={t.id} href={`/courses/${t.course.slug}`} className="card card-hover flex items-center gap-3 px-4 py-3">
                    <div className="flex-1">
                      <p className="font-semibold">{t.title}</p>
                      <p className="text-xs text-faint">{t.course.title}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-faint" />
                  </Link>
                ))}
              </div>
            </>
          )}

          {results && results.vocabulary.length > 0 && (
            <>
              <SectionTitle icon={Type}>Vocabulary</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {results.vocabulary.map((v) => (
                  <Link
                    key={v.id}
                    href={`/learn/${v.lesson.topic.course.slug}/${v.lesson.slug}`}
                    className="card card-hover px-4 py-2.5"
                  >
                    <span className="font-semibold text-brand">{v.word}</span>
                    <span className="ml-2 text-xs text-faint">{v.partOfSpeech}</span>
                    <p className="mt-0.5 max-w-md text-xs text-muted">
                      {v.thaiMeaning ? `${v.thaiMeaning} — ` : ""}
                      {v.meaning.slice(0, 80)}
                    </p>
                  </Link>
                ))}
              </div>
            </>
          )}

          {results && results.grammar.length > 0 && (
            <>
              <SectionTitle icon={BookMarked}>Grammar</SectionTitle>
              <div className="flex flex-col gap-2">
                {results.grammar.map((g) => (
                  <Link
                    key={g.id}
                    href={`/learn/${g.topic.course.slug}/${g.topic.lessons[0]?.slug ?? g.topic.slug}`}
                    className="card card-hover px-4 py-3"
                  >
                    <p className="font-semibold">{g.title}</p>
                    <p className="line-clamp-1 text-xs text-muted">{g.explanation}</p>
                  </Link>
                ))}
              </div>
            </>
          )}

          {total === 0 && (
            <div className="mt-8">
              <EmptyState
                title="No results found"
                description="Check the spelling or try a broader word."
                action={<Link href="/courses" className="btn btn-outline">Browse courses</Link>}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
