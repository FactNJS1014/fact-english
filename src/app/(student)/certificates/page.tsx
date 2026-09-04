import type { Metadata } from "next";
import Link from "next/link";
import { Award } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { getCertificatesForUser } from "@/lib/services/certificate.service";
import { EmptyState } from "@/components/ui/empty";

export const metadata: Metadata = { title: "Certificates" };

export default async function CertificatesPage() {
  const session = (await getSessionUser())!;
  const certificates = await getCertificatesForUser(session.id);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
        My certificates
      </h1>
      <p className="mb-6 text-sm text-muted">
        Earned automatically when you complete every course in a level.
      </p>

      {certificates.length === 0 ? (
        <EmptyState
          title="No certificates yet"
          description="Complete Level 1 (all courses: lessons, listening and quizzes passed) to earn your first FactBusiness English certificate."
          action={
            <Link href="/levels" className="btn btn-primary">
              Start Level 1
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {certificates.map((c) => (
            <Link
              key={c.id}
              href={`/certificates/${c.id}`}
              className="card card-hover flex items-center gap-4 p-5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-warning to-amber text-white">
                <Award className="h-6 w-6" />
              </span>
              <div>
                <p className="font-bold">
                  Level {c.level.levelNumber} · {c.level.name}
                </p>
                <p className="mt-0.5 text-xs text-faint">
                  {c.certificateId} · {new Date(c.issuedAt).toLocaleDateString("en-GB")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
