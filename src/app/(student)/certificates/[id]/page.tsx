import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, GraduationCap } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { getCertificateById } from "@/lib/services/certificate.service";
import { PrintButton } from "./print-button";

export const metadata: Metadata = { title: "Certificate" };

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = (await getSessionUser())!;
  const certificate = await getCertificateById(id);
  if (!certificate || certificate.user.username !== session.username) {
    notFound();
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-5 flex items-center justify-between">
        <Link href="/certificates" className="btn btn-ghost btn-sm">
          ← My certificates
        </Link>
        <PrintButton />
      </div>

      <div id="certificate" className="card overflow-hidden">
        <div
          aria-hidden
          className="h-2 w-full bg-gradient-to-r from-brand via-accent-cyan to-accent-purple"
        />
        <div className="relative p-8 sm:p-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 10% 10%, rgba(59,130,246,0.18), transparent 40%), radial-gradient(circle at 90% 90%, rgba(139,92,246,0.18), transparent 40%)",
            }}
          />
          <div className="relative flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-accent-purple text-white shadow-xl shadow-brand/25">
              <GraduationCap className="h-7 w-7" />
            </span>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-faint">
              FactBusiness English Learning Platform
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
              Certificate
            </h1>
            <p className="mt-6 text-sm text-muted">This certifies that</p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {certificate.user.firstName} {certificate.user.lastName}
            </p>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">
              has successfully completed all courses of
            </p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight text-brand">
              Level {certificate.level.levelNumber} — {certificate.level.name}
            </p>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted">
              <Award className="h-4 w-4 text-warning" />
              Proficiency: {certificate.level.label} Business English
            </div>

            <div className="mt-10 grid w-full max-w-md grid-cols-2 gap-6 text-sm">
              <div className="border-t border-line-strong pt-3">
                <p className="text-xs uppercase tracking-wider text-faint">Completion date</p>
                <p className="mt-1 font-semibold">
                  {new Date(certificate.issuedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="border-t border-line-strong pt-3">
                <p className="text-xs uppercase tracking-wider text-faint">Certificate ID</p>
                <p className="mt-1 font-semibold">{certificate.certificateId}</p>
              </div>
            </div>

            <p className="mt-10 rounded-full border border-line bg-surface-2 px-4 py-1.5 text-xs text-faint">
              Verify online: {appUrl}/verify/{certificate.verificationCode} · code{" "}
              <code className="font-mono">{certificate.verificationCode}</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
