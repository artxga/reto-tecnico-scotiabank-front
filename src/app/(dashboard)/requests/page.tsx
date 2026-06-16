"use client";

import { useState, Suspense } from "react";
import { useRequests } from "@/hooks/use-requests";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ArrowUpDown, Eye, PlusCircle, Calendar, Download, X } from "lucide-react";
import { Priority } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/components/providers/language-provider";

// Loading Fallback for Suspense Boundary
function RequestsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
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

      {/* Filters Panel Skeleton */}
      <div className="flex flex-col gap-4 p-5 bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-md">
        <div className="flex flex-col sm:flex-row gap-3">
          <Skeleton className="h-10.5 flex-1 rounded-xl" />
          <Skeleton className="h-10.5 w-28 rounded-xl" />
        </div>
      </div>

      {/* Mobile Cards Skeleton */}
      <div className="grid gap-4 md:hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 bg-white/70 border border-white rounded-2xl shadow-sm space-y-4 animate-pulse">
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

      {/* Desktop Table Skeleton */}
      <div className="hidden md:block bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-white overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-white/50 flex justify-between">
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

  // Read URL search params for pre-selected dashboard filters
  const initialStatus = searchParams.get("status") || "todos";
  const initialPriority = searchParams.get("priority") || "todos";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [priorityFilter, setPriorityFilter] = useState(initialPriority);
  const [sortBy, setSortBy] = useState("recent");
  const [showFilters, setShowFilters] = useState(initialStatus !== "todos" || initialPriority !== "todos");

  const statusTranslations: Record<string, string> = {
    pending: t("dashboard.stats.pending"),
    in_review: t("dashboard.stats.in_review"),
    approved: t("dashboard.stats.approved"),
    rejected: t("dashboard.stats.rejected"),
    closed: t("dashboard.stats.closed"),
  };

  const priorityTranslations: Record<string, string> = {
    low: language === "en" ? "Low" : "Baja",
    medium: language === "en" ? "Medium" : "Media",
    high: language === "en" ? "High" : "Alta",
    critical: language === "en" ? "Critical" : "Crítica",
  };

  const categoryTranslations: Record<string, string> = {
    "Hardware": language === "en" ? "Hardware" : "Hardware",
    "Accesos": language === "en" ? "Access" : "Accesos",
    "Software": language === "en" ? "Software" : "Software",
    "Infraestructura": language === "en" ? "Infrastructure" : "Infraestructura",
    "Recursos Humanos": language === "en" ? "Human Resources" : "Recursos Humanos",
    "Otros": language === "en" ? "Others" : "Otros",
  };

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

  let filtered = requests || [];

  if (search) {
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.requester.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (statusFilter !== "todos") {
    filtered = filtered.filter((r) => r.status === statusFilter);
  }

  if (priorityFilter !== "todos") {
    filtered = filtered.filter((r) => r.priority === priorityFilter);
  }

  filtered = filtered.sort((a, b) => {
    if (sortBy === "recent") return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
    if (sortBy === "oldest") return new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime();
    if (sortBy === "priority") {
      const p: Record<Priority, number> = { critical: 4, high: 3, medium: 2, low: 1 };
      return (p[b.priority] || 0) - (p[a.priority] || 0);
    }
    return 0;
  });

  // Export to CSV Functionality (Excel-ready UTF-8 BOM encoding)
  const exportToCSV = () => {
    const headers = language === "en"
      ? ["ID", "Title", "Requester", "Category", "Priority", "Status", "Creation Date"]
      : ["ID", "Título", "Solicitante", "Categoría", "Prioridad", "Estado", "Fecha de Creación"];

    const rows = filtered.map((req) => [
      req.id,
      `"${req.title.replace(/"/g, '""')}"`,
      `"${req.requester.replace(/"/g, '""')}"`,
      `"${(categoryTranslations[req.category] || req.category).replace(/"/g, '""')}"`,
      priorityTranslations[req.priority] || req.priority,
      statusTranslations[req.status] || req.status,
      new Date(req.creationDate).toLocaleDateString(language === "en" ? "en-US" : "es-ES")
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", language === "en" 
      ? `exported_requests_${new Date().toISOString().split("T")[0]}.csv`
      : `solicitudes_exportadas_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">{t("requests.title")}</h2>
          <p className="text-sm text-gray-500 mt-1">{t("requests.subtitle")}</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={exportToCSV}
            disabled={filtered.length === 0}
            className="flex-1 sm:flex-initial justify-center btn-secondary-liquid px-4 py-2.5 rounded-xl text-sm font-medium inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
          >
            <Download className="h-4 w-4" />
            {t("requests.exportCSV")}
          </button>
          <Link 
            href="/requests/new" 
            className="flex-1 sm:flex-initial justify-center btn-primary-liquid px-5 py-2.5 rounded-xl text-sm font-medium inline-flex items-center gap-2 transform active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            {t("dashboard.newRequest")}
          </Link>
        </div>
      </div>

      {/* Search and Filters Block */}
      <div className="flex flex-col gap-4 p-5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white dark:border-slate-800 rounded-2xl shadow-md transition-all duration-300">
        
        {/* Search input + Filter toggle button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder={t("requests.searchPlaceholder")}
              className="pl-10 text-gray-900 dark:text-white bg-white/40 dark:bg-slate-950/20 pr-10 border-gray-200 dark:border-slate-800/80 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-all h-10.5"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-semibold cursor-pointer select-none"
              >
                {language === "en" ? "Clear" : "Limpiar"}
              </button>
            )}
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl border font-medium inline-flex items-center gap-2 cursor-pointer transition-all shadow-sm hover:shadow h-10.5 ${
              showFilters || hasActiveFilters
                ? "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/30 dark:border-indigo-800 dark:text-indigo-300"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-slate-950/20 dark:border-slate-800/80 dark:text-gray-200 dark:hover:bg-slate-950/45"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="text-sm">{language === "en" ? "Filters" : "Filtros"}</span>
            {activeFiltersCount > 0 && (
              <span className="h-5 min-w-5 px-1.5 flex items-center justify-center rounded-full bg-indigo-600 dark:bg-indigo-500 text-[10px] font-bold text-white leading-none">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Collapsible Dropdowns Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-150/60 dark:border-slate-800/50 animate-in slide-in-from-top-2 duration-300">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">{language === "en" ? "Status" : "Estado"}</label>
              <Select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)} 
                className="w-full text-gray-800 dark:text-slate-200 bg-white/40 dark:bg-slate-950/20 border-gray-200 dark:border-slate-800/80 rounded-xl"
              >
                <option value="todos">{t("requests.allStatuses")}</option>
                <option value="pending">{statusTranslations.pending}</option>
                <option value="in_review">{statusTranslations.in_review}</option>
                <option value="approved">{statusTranslations.approved}</option>
                <option value="rejected">{statusTranslations.rejected}</option>
                <option value="closed">{statusTranslations.closed}</option>
              </Select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">{language === "en" ? "Priority" : "Prioridad"}</label>
              <Select 
                value={priorityFilter} 
                onChange={(e) => setPriorityFilter(e.target.value)} 
                className="w-full text-gray-800 dark:text-slate-200 bg-white/40 dark:bg-slate-950/20 border-gray-200 dark:border-slate-800/80 rounded-xl"
              >
                <option value="todos">{t("requests.allPriorities")}</option>
                <option value="low">{priorityTranslations.low}</option>
                <option value="medium">{priorityTranslations.medium}</option>
                <option value="high">{priorityTranslations.high}</option>
                <option value="critical">{priorityTranslations.critical}</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">{language === "en" ? "Order by" : "Ordenar por"}</label>
              <Select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                className="w-full text-gray-800 dark:text-slate-200 bg-white/40 dark:bg-slate-950/20 border-gray-200 dark:border-slate-800/80 rounded-xl"
              >
                <option value="recent">{language === "en" ? "Most recent" : "Más recientes"}</option>
                <option value="oldest">{language === "en" ? "Oldest" : "Más antiguas"}</option>
                <option value="priority">{language === "en" ? "Highest priority" : "Mayor prioridad"}</option>
              </Select>
            </div>
          </div>
        )}

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-150/40 dark:border-slate-800/30 animate-in fade-in duration-300">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 mr-1">{t("requests.activeFilters")}</span>
            {search && (
              <span className="inline-flex items-center gap-1 bg-indigo-50/70 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 text-xs font-medium px-2.5 py-1 rounded-full border border-indigo-100/50 dark:border-indigo-950/50">
                {language === "en" ? "Search:" : "Búsqueda:"} "{search}"
                <button
                  onClick={() => setSearch("")}
                  className="hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-full p-0.5 ml-1 transition-colors cursor-pointer"
                  title={language === "en" ? "Remove search" : "Quitar búsqueda"}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {statusFilter !== "todos" && (
              <span className="inline-flex items-center gap-1 bg-indigo-50/70 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 text-xs font-medium px-2.5 py-1 rounded-full border border-indigo-100/50 dark:border-indigo-950/50">
                {language === "en" ? "Status:" : "Estado:"} {statusTranslations[statusFilter] || statusFilter}
                <button
                  onClick={() => setStatusFilter("todos")}
                  className="hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-full p-0.5 ml-1 transition-colors cursor-pointer"
                  title={language === "en" ? "Remove status filter" : "Quitar filtro de estado"}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {priorityFilter !== "todos" && (
              <span className="inline-flex items-center gap-1 bg-indigo-50/70 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 text-xs font-medium px-2.5 py-1 rounded-full border border-indigo-100/50 dark:border-indigo-950/50">
                {language === "en" ? "Priority:" : "Prioridad:"} {priorityTranslations[priorityFilter] || priorityFilter}
                <button
                  onClick={() => setPriorityFilter("todos")}
                  className="hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-full p-0.5 ml-1 transition-colors cursor-pointer"
                  title={language === "en" ? "Remove priority filter" : "Quitar filtro de prioridad"}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300 transition-colors ml-2 cursor-pointer"
            >
              {t("requests.clearFilters")}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Card List View (visible on mobile/tablet, hidden on desktop) */}
      <div className="grid gap-4 md:hidden">
        {filtered.map((req) => (
          <Link 
            key={req.id} 
            href={`/requests/${req.id}`}
            className="block p-5 bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
          >
            <div className="flex justify-between items-start gap-2 mb-2">
              <h3 className="font-bold text-gray-900 line-clamp-2 pr-2 leading-snug">{req.title}</h3>
              <Badge variant={req.status} className="shrink-0" />
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
              <span>{req.requester}</span>
              <span className="font-mono bg-slate-100/80 px-2 py-0.5 rounded text-[10px] text-gray-600">{categoryTranslations[req.category] || req.category}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-440 dark:text-gray-500">
                <Calendar className="h-3.5 w-3.5" />
                <span>{new Date(req.creationDate).toLocaleDateString(language === "en" ? "en-US" : "es-ES")}</span>
              </div>
              <Badge variant={req.priority} />
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white p-12 text-center text-gray-500">
            <div className="flex flex-col items-center gap-2">
              <Search className="h-8 w-8 text-gray-300" />
              <p>{t("requests.noResults")}</p>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Table View (visible on desktop, hidden on mobile) */}
      <div className="hidden md:block bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/50 text-gray-600 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">{language === "en" ? "Request Title" : "Título de la Solicitud"}</th>
                <th className="px-6 py-4">{language === "en" ? "Requester" : "Solicitante"}</th>
                <th className="px-6 py-4">{t("requests.table.category")}</th>
                <th className="px-6 py-4">{language === "en" ? "Date" : "Fecha"}</th>
                <th className="px-6 py-4">{t("requests.table.priority")}</th>
                <th className="px-6 py-4">{t("requests.table.status")}</th>
                <th className="px-6 py-4 text-right">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((req) => (
                <tr key={req.id} className="hover:bg-white/60 transition-colors group">
                  <td className="px-6 py-4 font-semibold text-gray-900 max-w-[280px] truncate" title={req.title}>{req.title}</td>
                  <td className="px-6 py-4 text-gray-600">{req.requester}</td>
                  <td className="px-6 py-4 text-gray-600">{categoryTranslations[req.category] || req.category}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(req.creationDate).toLocaleDateString(language === "en" ? "en-US" : "es-ES")}</td>
                  <td className="px-6 py-4">
                    <Badge variant={req.priority} />
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={req.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/requests/${req.id}`} className="inline-flex items-center justify-center p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-gray-300" />
                      <p>{t("requests.noResults")}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
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
