import { db } from "./db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

/**
 * Server-side authentication.
 * Sessions live in the database (Session table) keyed by a random token stored
 * in an HTTP-only, SameSite=Lax cookie. Expiration is enforced server-side:
 * every session expires 24 hours after creation. localStorage is never used.
 */
export const SESSION_COOKIE_NAME = "factenglish_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  avatarUrl: string | null;
  xp: number;
  isActive: boolean;
  bypassLevelLock: boolean;
  currentLevelId: string | null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string): Promise<string> {
  const sessionToken = uuidv4();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  await db.session.create({
    data: { sessionToken, userId, expiresAt },
  });

  return sessionToken;
}

export async function setSessionCookie(
  sessionToken: string,
  remember: boolean
) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    // Hard 24h expiry either way. Without "Remember me" the cookie also dies
    // when the browser closes; the DB row still expires after 24h regardless.
    maxAge: remember ? SESSION_MAX_AGE_SECONDS : undefined,
    path: "/",
  });
}

export async function getSessionUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionToken) return null;

    const session = await db.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });
    if (!session) return null;

    // Enforce server-side expiration
    if (new Date() > session.expiresAt) {
      await db.session.delete({ where: { id: session.id } });
      return null;
    }
    if (!session.user.isActive) return null;

    return {
      id: session.user.id,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      username: session.user.username,
      email: session.user.email,
      role: session.user.role,
      avatarUrl: session.user.avatarUrl,
      xp: session.user.xp,
      isActive: session.user.isActive,
      bypassLevelLock: session.user.bypassLevelLock,
      currentLevelId: session.user.currentLevelId,
    };
  } catch {
    return null;
  }
}

/** Redirects-aware guard for layouts/server components. */
export async function destroySession() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (sessionToken) {
      await db.session.deleteMany({ where: { sessionToken } });
    }
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch {
    // ignore
  }
}
