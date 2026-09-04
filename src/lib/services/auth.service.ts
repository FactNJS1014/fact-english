import { db } from "../db";
import {
  hashPassword,
  verifyPassword,
  createSession,
  setSessionCookie,
} from "../auth";

export type AuthResult =
  | { ok: true; userId: string; role: "STUDENT" | "ADMIN" }
  | { ok: false; error: string };

export async function registerUser(data: {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  try {
    const existing = await db.user.findFirst({
      where: { OR: [{ email: data.email }, { username: data.username }] },
      select: { email: true, username: true },
    });
    if (existing) {
      if (existing.email === data.email) return { ok: false, error: "This email is already registered." };
      return { ok: false, error: "This username is already taken." };
    }

    const passwordHash = await hashPassword(data.password);
    const user = await db.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        passwordHash,
        role: "STUDENT",
      },
    });

    // Auto-login after registration
    const token = await createSession(user.id);
    await setSessionCookie(token, false);

    return { ok: true, userId: user.id, role: "STUDENT" };
  } catch (error) {
    console.error("[auth.service] register error:", error);
    return {
      ok: false,
      error:
        "We could not complete your registration. Please try again in a moment.",
    };
  }
}

export async function loginUser(data: {
  identifier: string;
  password: string;
  rememberMe: boolean;
}): Promise<AuthResult> {
  try {
    const user = await db.user.findFirst({
      where: {
        OR: [{ email: data.identifier }, { username: data.identifier }],
      },
      select: {
        id: true,
        passwordHash: true,
        isActive: true,
        role: true,
      },
    });
    if (!user) return { ok: false, error: "Invalid email/username or password." };

    if (!user.isActive) {
      return { ok: false, error: "This account has been deactivated. Contact support." };
    }

    const valid = await verifyPassword(data.password, user.passwordHash);
    if (!valid) return { ok: false, error: "Invalid email/username or password." };

    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = await createSession(user.id);
    await setSessionCookie(token, data.rememberMe);

    return { ok: true, userId: user.id, role: user.role };
  } catch (error) {
    console.error("[auth.service] login error:", error);
    return { ok: false, error: "Sign in failed. Please try again." };
  }
}

export async function findUserByIdentity(identifier: string) {
  return db.user.findFirst({
    where: { OR: [{ email: identifier }, { username: identifier }] },
    select: { id: true, firstName: true, email: true },
  });
}

export async function emailExists(email: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });
  return Boolean(user);
}
