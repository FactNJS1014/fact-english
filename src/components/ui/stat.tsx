import type { LucideIcon } from "lucide-react";
import { Card } from "./card";

export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  tone = "brand",
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  sub?: string;
  tone?: "brand" | "green" | "amber" | "purple" | "cyan";
}) {
  const toneClass = {
    brand: "bg-brand-soft text-brand",
    green: "bg-success/10 text-success",
    amber: "bg-warning/10 text-warning",
    purple: "bg-accent-purple/10 text-accent-purple",
    cyan: "bg-accent-cyan/10 text-accent-cyan",
  }[tone];

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-wider text-faint">
            {label}
          </p>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-ink">
            {value}
          </p>
          {sub ? <p className="mt-1 text-xs text-muted">{sub}</p> : null}
        </div>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneClass}`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </Card>
  );
}
