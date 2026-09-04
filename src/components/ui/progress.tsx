import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  barClassName,
  tone = "brand",
}: {
  value: number;
  className?: string;
  barClassName?: string;
  tone?: "brand" | "green" | "amber" | "purple" | "cyan";
}) {
  const toneClass = {
    brand: "from-brand to-accent-cyan",
    green: "from-success to-accent-cyan",
    amber: "from-warning to-warning",
    purple: "from-accent-purple to-brand",
    cyan: "from-accent-cyan to-brand",
  }[tone];

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-surface-3",
        className
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-gradient-to-r transition-all duration-500",
          toneClass,
          barClassName
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
