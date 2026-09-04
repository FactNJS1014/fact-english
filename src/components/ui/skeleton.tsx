import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse-soft rounded-xl bg-surface-3",
        className
      )}
      {...props}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-10 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-72 lg:col-span-2" />
        <Skeleton className="h-72" />
      </div>
    </div>
  );
}

export function LessonSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-9 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

export function QuizSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-56 w-full" />
      <Skeleton className="h-10 w-40 self-end" />
    </div>
  );
}

export function ListeningSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-16 w-full rounded-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}
