import { Skeleton } from "@/components/ui/skeleton";

export function RequestsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2 w-full max-w-[280px]">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Skeleton className="h-10 flex-1 sm:flex-initial sm:w-28" />
          <Skeleton className="h-10 flex-1 sm:flex-initial sm:w-28" />
        </div>
      </div>
      <div className="flex flex-col gap-4 p-5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white rounded-2xl shadow-md">
        <div className="flex flex-col sm:flex-row gap-3">
          <Skeleton className="h-10.5 flex-1 rounded-xl" />
          <Skeleton className="h-10.5 w-28 rounded-xl" />
        </div>
      </div>
      <div className="grid gap-4 md:hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-5 bg-white/70 dark:bg-slate-900/60 border border-white rounded-2xl shadow-sm space-y-4 animate-pulse"
          >
            <div className="flex justify-between items-start">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-3.5 w-1/4" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <Skeleton className="h-3.5 w-1/3" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:block bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-sm border border-white overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-white/50 dark:bg-slate-900/40 flex justify-between">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
        <div className="divide-y divide-gray-50">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-5 flex justify-between items-center">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
