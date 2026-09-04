import { getSessionUser, type AuthUser } from "../auth";

export type ActionResult = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  message?: string;
  code?: string;
};

export function zodErrors(
  error: { issues: { path: (string | number | symbol)[]; message: string }[] }
): string[] {
  return error.issues.map((i) => i.message);
}

export function fieldErrors(
  error: { issues: { path: (string | number | symbol)[]; message: string }[] }
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export const UNAUTHENTICATED = {
  ok: false,
  code: "UNAUTHENTICATED",
  error: "Your session has expired. Please login again.",
} as const;

/** Require a live DB session; returns the user or null when the session expired. */
export async function requireActionUser(): Promise<AuthUser | null> {
  return getSessionUser();
}

export async function requireActionAdmin(): Promise<AuthUser | null> {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}
