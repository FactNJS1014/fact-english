import type { Metadata } from "next";
import Link from "next/link";
import { LifeBuoy, MailQuestion } from "lucide-react";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Forgot Password" };

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const sp = await searchParams;

  return (
    <div className="card animate-fade-up overflow-hidden">
      <div className="border-b border-line bg-gradient-to-r from-warning/10 via-transparent to-transparent px-6 py-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/15 text-warning">
            <MailQuestion className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">
              Forgot your password?
            </h1>
            <p className="text-sm text-muted">
              We&apos;ll help you get back into your account
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6">
        {sp.sent === "1" ? (
          <Banner tone="success" param="sent">
            If an account exists for that email, we will send a reset link to
            it shortly.
          </Banner>
        ) : null}

        <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface-2 p-4 text-sm leading-relaxed text-muted">
          <p>
            <strong className="text-ink">Email-based reset is not enabled yet.</strong>{" "}
            This learning platform is self-hosted; to reset your password please
            contact your administrator, who can reset it from the Admin →
            Users area.
          </p>
          <p className="flex items-center gap-2">
            <LifeBuoy className="h-4 w-4 shrink-0 text-brand" />
            Demo accounts (from seed): <code className="rounded bg-surface-3 px-1.5 py-0.5 text-xs">student@factbusiness.com</code> /{" "}
            <code className="rounded bg-surface-3 px-1.5 py-0.5 text-xs">password123</code>
          </p>
        </div>

        <Link href="/login" className="btn btn-outline w-full">
          Back to Login
        </Link>
        <form action="/forgot-password" method="get" className="w-full">
          <input type="hidden" name="sent" value="1" />
          <Button type="submit" size="lg" className="w-full">
            Request reset (demo)
          </Button>
        </form>
      </div>
    </div>
  );
}
