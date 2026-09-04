import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, ShieldQuestion } from "lucide-react";
import { getCertificateByVerification } from "@/lib/services/certificate.service";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Verify Certificate" };

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const certificate = await getCertificateByVerification(code);

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-16">
      <div className="text-center">
        {certificate ? (
          <Card className="border-success/40 p-8">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
              <BadgeCheck className="h-7 w-7" />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold">Certificate verified ✓</h1>
            <p className="mt-1 text-sm text-muted">
              This is an official FactBusiness English certificate.
            </p>
            <div className="mt-6 rounded-2xl border border-line bg-surface-2 p-5 text-left">
              <Row label="Holder" value={`${certificate.user.firstName} ${certificate.user.lastName}`} />
              <Row label="Level" value={`Level ${certificate.level.levelNumber} — ${certificate.level.name}`} />
              <Row label="Proficiency" value={certificate.level.label} />
              <Row
                label="Issued"
                value={new Date(certificate.issuedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              />
              <Row label="Certificate ID" value={certificate.certificateId} />
              <Row label="Verification code" value={certificate.verificationCode} mono />
            </div>
          </Card>
        ) : (
          <Card className="border-danger/30 p-8">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger/15 text-danger">
              <ShieldQuestion className="h-7 w-7" />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold">Not found</h1>
            <p className="mt-1 text-sm text-muted">
              No certificate matches this verification code. Check the code or
              contact the certificate owner.
            </p>
          </Card>
        )}
        <Link href="/" className="btn btn-ghost mt-8">
          ← Back to FactBusiness English
        </Link>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-2.5 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wider text-faint">{label}</span>
      <span className={`text-sm font-semibold ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
