"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getSessionUser, destroySession, verifyPassword, hashPassword } from "../auth";
import { registerUser, loginUser } from "../services/auth.service";
import { db } from "../db";
import { registerSchema, loginSchema, profileSchema, passwordChangeSchema } from "../validations";
import { rateLimit } from "../rate-limit";
import { zodErrors, fieldErrors, type ActionResult } from "./action-helpers";

async function ipKey(scope: string) {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "local";
  return `${scope}:${ip}`;
}

export async function registerAction(formData: FormData): Promise<void> {
  const parsed = registerSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    redirect(`/register?error=${encodeURIComponent(zodErrors(parsed.error)[0] ?? "Please check your details.")}`);
  }

  const limit = rateLimit(await ipKey("register"), 10, 15 * 60 * 1000);
  if (!limit.ok) {
    redirect(`/register?error=${encodeURIComponent("Too many attempts. Please wait a few minutes and try again.")}`);
  }

  const result = await registerUser(parsed.data);
  if (!result.ok) {
    redirect(`/register?error=${encodeURIComponent(result.error)}`);
  }
  redirect("/dashboard?welcome=1");
}

export async function loginAction(formData: FormData): Promise<void> {
  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
    rememberMe: formData.get("rememberMe") === "on",
  });
  if (!parsed.success) {
    redirect(`/login?error=${encodeURIComponent(zodErrors(parsed.error)[0] ?? "Please check your details.")}`);
  }

  const limit = rateLimit(await ipKey("login"), 10, 15 * 60 * 1000);
  if (!limit.ok) {
    redirect(`/login?error=${encodeURIComponent("Too many login attempts. Please wait a few minutes.")}`);
  }

  const result = await loginUser(parsed.data);
  if (!result.ok) {
    redirect(`/login?error=${encodeURIComponent(result.error)}`);
  }

  const redirectTo =
    (formData.get("redirectTo") as string)?.startsWith("/") && !(formData.get("redirectTo") as string).startsWith("//")
      ? (formData.get("redirectTo") as string)
      : "/dashboard";
  redirect(redirectTo);
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}

export async function updateProfileAction(formData: FormData): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Your session has expired. Please login again." };

  const parsed = profileSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
  });
  if (!parsed.success) {
    const errors = zodErrors(parsed.error);
    return { ok: false, error: errors[0], fieldErrors: fieldErrors(parsed.error) };
  }

  const existing = await db.user.findFirst({
    where: { email: parsed.data.email, id: { not: user.id } },
    select: { id: true },
  });
  if (existing) return { ok: false, error: "This email is used by another account." };

  await db.user.update({
    where: { id: user.id },
    data: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
    },
  });
  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { ok: true, message: "Profile updated." };
}

export async function changePasswordAction(formData: FormData): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Your session has expired. Please login again." };

  const parsed = passwordChangeSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    const errors = zodErrors(parsed.error);
    return { ok: false, error: errors[0], fieldErrors: fieldErrors(parsed.error) };
  }

  const row = await db.user.findUnique({ where: { id: user.id }, select: { passwordHash: true } });
  if (!row) return { ok: false, error: "Account not found." };

  const valid = await verifyPassword(parsed.data.currentPassword, row.passwordHash);
  if (!valid) return { ok: false, error: "Current password is incorrect." };

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await db.user.update({ where: { id: user.id }, data: { passwordHash } });
  return { ok: true, message: "Password updated." };
}
