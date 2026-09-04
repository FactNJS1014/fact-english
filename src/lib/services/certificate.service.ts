import { db } from "../db";
import type { Prisma } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

type Tx = Prisma.TransactionClient;

export function generateCertificateId(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `FB-${year}-${rand}`;
}

export function generateVerificationCode(): string {
  return uuidv4().replace(/-/g, "").slice(0, 12).toUpperCase();
}

/** Issue a level certificate if the level was fully completed and none exists yet. */
export async function issueCertificateForLevelTx(
  tx: Tx,
  userId: string,
  levelId: string
): Promise<{ created: boolean; certificateId: string | null }> {
  const existing = await tx.certificate.findFirst({
    where: { userId, levelId },
    select: { certificateId: true },
  });
  if (existing) return { created: false, certificateId: existing.certificateId };

  const certificateId = generateCertificateId();
  const verificationCode = generateVerificationCode();
  await tx.certificate.create({
    data: { userId, levelId, certificateId, verificationCode },
  });
  return { created: true, certificateId };
}

export async function getCertificatesForUser(userId: string) {
  return db.certificate.findMany({
    where: { userId },
    include: {
      level: { select: { name: true, label: true, levelNumber: true } },
    },
    orderBy: { issuedAt: "desc" },
  });
}

export async function getCertificateByVerification(code: string) {
  return db.certificate.findUnique({
    where: { verificationCode: code.toUpperCase() },
    include: {
      user: { select: { firstName: true, lastName: true } },
      level: { select: { name: true, label: true, levelNumber: true } },
    },
  });
}

export async function getCertificateById(id: string) {
  return db.certificate.findUnique({
    where: { id },
    include: {
      user: { select: { firstName: true, lastName: true, username: true } },
      level: { select: { name: true, label: true, levelNumber: true } },
    },
  });
}
