import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2 w-full max-w-[280px]">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-10 w-full sm:w-[150px] shrink-0" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-4 sm:p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-8 w-8 rounded-xl shrink-0" />
            </div>
            <Skeleton className="h-8 w-1/3" />
          </div>
        ))}
      </div>

      {/* Charts Layout Skeleton */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 w-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 shadow-sm h-[320px] space-y-4"
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </div>
        ))}
      </div>

      {/* Recent Activity Skeleton (Full Width) */}
      <div className="w-full">
        <div className="rounded-2xl border border-white bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 shadow-sm h-auto min-h-[300px] space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-4 items-center p-3 rounded-xl border border-transparent"
              >
                <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between">
                    <Skeleton className="h-3.5 w-1/4" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
