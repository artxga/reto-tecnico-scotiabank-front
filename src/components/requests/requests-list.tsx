"use client";

import { useState, useMemo, useEffect } from "react";
import { useRequests } from "@/hooks/use-requests";
import { useSearchParams } from "next/navigation";
import { Priority } from "@/lib/types";
import { useLanguage } from "@/components/providers/language-provider";
import { useCsvExport } from "@/hooks/use-csv-export";

import { RequestsHeader } from "@/components/requests/requests-header";
import { RequestsFilters } from "@/components/requests/requests-filters";
import { RequestsMobileList } from "@/components/requests/requests-mobile-list";
import { RequestsTable } from "@/components/requests/requests-table";
import { KanbanBoard } from "@/components/dashboard/kanban-board";

export function RequestsList() {
  const { data: requests } = useRequests();
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  const { exportToCSV } = useCsvExport();

  const initialStatus = searchParams.get("status") || "all";
  const initialPriority = searchParams.get("priority") || "all";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [priorityFilter, setPriorityFilter] = useState(initialPriority);
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "priority">("recent");
  const [showFilters, setShowFilters] = useState(
    initialStatus !== "all" || initialPriority !== "all",
  );
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("requestsViewMode") as "list" | "kanban";
    if (saved === "list" || saved === "kanban") {
      setViewMode(saved);
    }
  }, []);

  const handleViewModeChange = (mode: "list" | "kanban") => {
    setViewMode(mode);
    localStorage.setItem("requestsViewMode", mode);
  };

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
      low: t("requests.priorities.low"),
      medium: t("requests.priorities.medium"),
      high: t("requests.priorities.high"),
      critical: t("requests.priorities.critical"),
    }),
    [t],
  );

  const categoryTranslations = useMemo(
    () => ({
      hardware: t("requests.categories.hardware"),
      access: t("requests.categories.access"),
      software: t("requests.categories.software"),
      infrastructure: t("requests.categories.infrastructure"),
      human_resources: t("requests.categories.human_resources"),
      others: t("requests.categories.others"),
    }),
    [t],
  );

  const activeFiltersCount =
    (statusFilter !== "all" ? 1 : 0) +
    (priorityFilter !== "all" ? 1 : 0) +
    (search !== "" ? 1 : 0);

  const hasActiveFilters = activeFiltersCount > 0;

  const clearAllFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
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

    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (priorityFilter !== "all") {
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
        setViewMode={handleViewModeChange}
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

      {!mounted ? (
        <div className="w-full flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : viewMode === "list" ? (
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
