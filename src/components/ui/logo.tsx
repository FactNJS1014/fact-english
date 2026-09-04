import Link from "next/link";
import { cn } from "@/lib/utils";
import { GraduationCap } from "lucide-react";

export function Logo({
  href = "/",
  className,
  compact = false,
}: {
  href?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("group flex items-center gap-2.5", className)}
      aria-label="FactBusiness English home"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-accent-purple text-white shadow-lg shadow-brand/25 transition group-hover:shadow-brand/40">
        <GraduationCap className="h-5 w-5" />
      </span>
      {!compact ? (
        <span className="flex flex-col leading-tight">
          <span className="text-[0.95rem] font-extrabold tracking-tight text-ink">
            FactBusiness <span className="text-brand">English</span>
          </span>
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-faint">
            Business English Platform
          </span>
        </span>
      ) : null}
    </Link>
  );
}
