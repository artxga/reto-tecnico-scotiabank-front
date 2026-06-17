"use client";

import { useState, Suspense, useMemo } from "react";
import { useRequests } from "@/hooks/use-requests";
import { useSearchParams } from "next/navigation";
import { Priority } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/components/providers/language-provider";
import { useCsvExport } from "@/hooks/use-csv-export";

import { RequestsHeader } from "@/components/requests/requests-header";
import { RequestsFilters } from "@/components/requests/requests-filters";
import { RequestsMobileList } from "@/components/requests/requests-mobile-list";
import { RequestsTable } from "@/components/requests/requests-table";
import { KanbanBoard } from "@/components/dashboard/kanban-board";

function RequestsSkeleton() {
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

function RequestsList() {
  const { data: requests } = useRequests();
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  const { exportToCSV } = useCsvExport();

  const initialStatus = searchParams.get("status") || "todos";
  const initialPriority = searchParams.get("priority") || "todos";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [priorityFilter, setPriorityFilter] = useState(initialPriority);
  const [sortBy, setSortBy] = useState("recent");
  const [showFilters, setShowFilters] = useState(
    initialStatus !== "todos" || initialPriority !== "todos",
  );
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

  const statusTranslations = useMemo(
    () => ({
      pending: t("dashboard.stats.pending"),
      in_review: t("dashboard.stats.in_review"),
      approved: t("dashboard.stats.approved"),
      rejected: t("dashboard.stats.rejected"),
      closed: t("dashboard.stats.closed"),
    }),
    [t],
  );

  const priorityTranslations = useMemo(
    () => ({
      low: language === "en" ? "Low" : "Baja",
      medium: language === "en" ? "Medium" : "Media",
      high: language === "en" ? "High" : "Alta",
      critical: language === "en" ? "Critical" : "Crítica",
    }),
    [language],
  );

  const categoryTranslations = useMemo(
    () => ({
      Hardware: language === "en" ? "Hardware" : "Hardware",
      Accesos: language === "en" ? "Access" : "Accesos",
      Software: language === "en" ? "Software" : "Software",
      Infraestructura: language === "en" ? "Infrastructure" : "Infraestructura",
      "Recursos Humanos": language === "en" ? "Human Resources" : "Recursos Humanos",
      Otros: language === "en" ? "Others" : "Otros",
    }),
    [language],
  );

  const activeFiltersCount =
    (statusFilter !== "todos" ? 1 : 0) +
    (priorityFilter !== "todos" ? 1 : 0) +
    (search !== "" ? 1 : 0);

  const hasActiveFilters = activeFiltersCount > 0;

  const clearAllFilters = () => {
    setStatusFilter("todos");
    setPriorityFilter("todos");
    setSearch("");
  };

  const filtered = useMemo(() => {
    let result = requests || [];

    if (search) {
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.requester.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (statusFilter !== "todos") {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (priorityFilter !== "todos") {
      result = result.filter((r) => r.priority === priorityFilter);
    }

    return result.sort((a, b) => {
      if (sortBy === "recent")
        return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
      if (sortBy === "oldest")
        return new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime();
      if (sortBy === "priority") {
        const p: Record<Priority, number> = { critical: 4, high: 3, medium: 2, low: 1 };
        return (p[b.priority] || 0) - (p[a.priority] || 0);
      }
      return 0;
    });
  }, [requests, search, statusFilter, priorityFilter, sortBy]);

  return (
    <div className="space-y-6">
      <RequestsHeader
        onExportCSV={() =>
          exportToCSV({
            filtered,
            language,
            categoryTranslations,
            priorityTranslations,
            statusTranslations,
          })
        }
        exportDisabled={filtered.length === 0}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <RequestsFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        clearAllFilters={clearAllFilters}
        activeFiltersCount={activeFiltersCount}
        hasActiveFilters={hasActiveFilters}
        statusTranslations={statusTranslations}
        priorityTranslations={priorityTranslations}
      />

      {viewMode === "list" ? (
        <>
          <RequestsMobileList filtered={filtered} categoryTranslations={categoryTranslations} />
          <RequestsTable filtered={filtered} categoryTranslations={categoryTranslations} />
        </>
      ) : (
        <div className="w-full pt-2">{filtered && <KanbanBoard requests={filtered} />}</div>
      )}
    </div>
  );
}

export default function RequestsPage() {
  return (
    <Suspense fallback={<RequestsSkeleton />}>
      <RequestsList />
    </Suspense>
  );
}
