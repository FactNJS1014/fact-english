import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col gap-6 px-4 py-10">
      <Skeleton className="h-12 w-2/3" />
      <Skeleton className="h-5 w-1/3" />
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Skeleton className="h-44" />
        <Skeleton className="h-44" />
        <Skeleton className="h-44" />
      </div>
    </div>
  );
}
