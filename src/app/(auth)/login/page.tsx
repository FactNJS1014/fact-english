import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { loginAction } from "@/lib/actions/auth.actions";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Login" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string; expired?: string }>;
}) {
  const sp = await searchParams;
  const expired = sp.expired === "1";

  return (
    <div className="card animate-fade-up overflow-hidden">
      <div className="border-b border-line bg-gradient-to-r from-brand-soft via-transparent to-transparent px-6 py-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-accent-purple text-white">
            <KeyRound className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted">Login to continue learning</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6">
        {expired ? (
          <Banner tone="warning" param="expired">
            Your session has expired. Please login again.
          </Banner>
        ) : null}
        {sp.error ? (
          <Banner tone="danger" param="error">
            {sp.error}
          </Banner>
        ) : null}

        <form action={loginAction} className="flex flex-col gap-4">
          <input type="hidden" name="redirectTo" value={sp.redirect ?? "/dashboard"} />
          <div className="flex flex-col gap-1">
            <label className="label" htmlFor="identifier">
              Email or Username
            </label>
            <input
              id="identifier"
              name="identifier"
              className="input"
              autoComplete="username"
              placeholder="you@company.com"
              required
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="input"
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                name="rememberMe"
                className="h-4 w-4 rounded accent-[var(--brand)]"
              />
              Remember me
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-brand hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <Button type="submit" size="lg" className="mt-1 w-full">
            LOGIN
          </Button>
        </form>

        <p className="mt-2 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href={`/register${sp.redirect ? `?redirect=${encodeURIComponent(sp.redirect)}` : ""}`}
            className="font-semibold text-brand hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
