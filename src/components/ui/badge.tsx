import { cn } from "@/lib/utils";

type Tone = "default" | "brand" | "green" | "amber" | "red" | "purple" | "cyan";

const toneClass: Record<Tone, string> = {
  default: "bg-surface-2 text-muted border-line",
  brand: "bg-brand-soft text-brand border-brand/30",
  green: "bg-success/10 text-success border-success/30",
  amber: "bg-warning/10 text-warning border-warning/30",
  red: "bg-danger/10 text-danger border-danger/30",
  purple: "bg-accent-purple/10 text-accent-purple border-accent-purple/30",
  cyan: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30",
};

export function Badge({
  tone = "default",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span className={cn("chip", toneClass[tone], className)} {...props} />
  );
}
