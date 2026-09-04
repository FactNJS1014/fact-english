import type { Metadata } from "next";
import Link from "next/link";
import { NotebookPen } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui/empty";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { DeleteNoteButton } from "./delete-note-button";

export const metadata: Metadata = { title: "My Notes" };

export default async function NotesPage() {
  const session = await getSessionUser();
  const notes = await db.note.findMany({
    where: { userId: session!.id },
    orderBy: { updatedAt: "desc" },
    include: {
      lesson: {
        select: {
          id: true,
          title: true,
          slug: true,
          topic: {
            select: {
              title: true,
              course: { select: { title: true, slug: true } },
            },
          },
        },
      },
    },
  });

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold tracking-tight sm:text-3xl">My notes</h1>
      <p className="mb-6 text-sm text-muted">
        Personal notes you saved on lessons — like a vocabulary notebook.
      </p>

      {notes.length === 0 ? (
        <EmptyState
          title="No notes yet"
          description="Open any lesson and use the “Personal notes” box on the right to save what you want to remember."
          action={
            <Link href="/levels" className="btn btn-primary">
              Start learning
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {notes.map((note) => (
            <Card key={note.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-brand">
                  <NotebookPen className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {note.lesson.topic.course.title}
                  </span>
                </div>
                <DeleteNoteButton
                  lessonId={note.lesson.id}
                  returnPath="/notes"
                />
              </div>
              <Link
                href={`/learn/${note.lesson.topic.course.slug}/${note.lesson.slug}`}
                className="mt-1 font-bold hover:text-brand"
              >
                {note.lesson.title}
              </Link>
              <p className="mt-2 flex-1 whitespace-pre-wrap rounded-xl border border-line bg-surface-2 p-3 text-sm leading-relaxed text-muted">
                {note.content}
              </p>
              <p className="mt-2 text-xs text-faint">Updated {formatDate(note.updatedAt)}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
