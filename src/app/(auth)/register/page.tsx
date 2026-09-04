import type { Metadata } from "next";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { registerAction } from "@/lib/actions/auth.actions";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Create Account" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>;
}) {
  const sp = await searchParams;

  return (
    <div className="card animate-fade-up overflow-hidden">
      <div className="border-b border-line bg-gradient-to-r from-brand-soft via-transparent to-transparent px-6 py-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-accent-cyan text-white">
            <UserPlus className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-muted">
              Free access to all learning content
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6">
        {sp.error ? (
          <Banner tone="danger" param="error">
            {sp.error}
          </Banner>
        ) : null}

        <form action={registerAction} className="flex flex-col gap-3.5">
          <input type="hidden" name="redirectTo" value={sp.redirect ?? "/dashboard"} />
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="label" htmlFor="firstName">
                First Name
              </label>
              <input id="firstName" name="firstName" className="input" autoComplete="given-name" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="label" htmlFor="lastName">
                Last Name
              </label>
              <input id="lastName" name="lastName" className="input" autoComplete="family-name" required />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              className="input"
              autoComplete="username"
              minLength={3}
              required
              placeholder="min. 3 characters (letters, numbers, _)"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input id="email" name="email" type="email" className="input" autoComplete="email" required />
          </div>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="input"
                autoComplete="new-password"
                minLength={8}
                required
                placeholder="min. 8 characters"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="input"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
          </div>
          <Button type="submit" size="lg" className="mt-1 w-full">
            CREATE ACCOUNT
          </Button>
        </form>

        <p className="mt-1 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link
            href={`/login${sp.redirect ? `?redirect=${encodeURIComponent(sp.redirect)}` : ""}`}
            className="font-semibold text-brand hover:underline"
          >
            Login
          </Link>
        </p>
        <p className="text-center text-xs text-faint">
          By creating an account you agree to learn Business English every day.
        </p>
      </div>
    </div>
  );
}
