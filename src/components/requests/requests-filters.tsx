import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useLanguage } from "@/components/providers/language-provider";
import { Badge } from "../ui/badge";
import { REQUEST_STATUSES, PRIORITIES } from "@/lib/types";

interface RequestsFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  priorityFilter: string;
  setPriorityFilter: (val: string) => void;
  sortBy: "recent" | "oldest" | "priority";
  setSortBy: (val: "recent" | "oldest" | "priority") => void;
  showFilters: boolean;
  setShowFilters: (val: boolean) => void;
  clearAllFilters: () => void;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  statusTranslations: Record<string, string>;
  priorityTranslations: Record<string, string>;
}

export function RequestsFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters,
  clearAllFilters,
  activeFiltersCount,
  hasActiveFilters,
  statusTranslations,
  priorityTranslations,
}: RequestsFiltersProps) {
  const { t, language } = useLanguage();

  return (
    <div className="flex flex-col gap-4 p-5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white dark:border-slate-800 rounded-2xl shadow-md transition-all duration-300">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder={t("requests.searchPlaceholder")}
            id="search"
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
              : "bg-white border-gray-200 text-gray-700 hover:bg-white/60 dark:bg-slate-950/20 dark:border-slate-800/80 dark:text-gray-200 dark:hover:bg-slate-950/45"
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

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-150/60 dark:border-slate-800/50 animate-in slide-in-from-top-2 duration-300">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
              {language === "en" ? "Status" : "Estado"}
            </label>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-gray-800 dark:text-slate-200 bg-white/40 dark:bg-slate-950/20 border-gray-200 dark:border-slate-800/80 rounded-xl"
            >
              <option value="all">{t("requests.allStatuses")}</option>
              {REQUEST_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {statusTranslations[s]}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
              {language === "en" ? "Priority" : "Prioridad"}
            </label>
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full text-gray-800 dark:text-slate-200 bg-white/40 dark:bg-slate-950/20 border-gray-200 dark:border-slate-800/80 rounded-xl"
            >
              <option value="all">{t("requests.allPriorities")}</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {priorityTranslations[p]}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
              {language === "en" ? "Order by" : "Ordenar por"}
            </label>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "recent" | "oldest" | "priority")}
              className="w-full text-gray-800 dark:text-slate-200 bg-white/40 dark:bg-slate-950/20 border-gray-200 dark:border-slate-800/80 rounded-xl"
            >
              <option value="recent">{language === "en" ? "Most recent" : "Más recientes"}</option>
              <option value="oldest">{language === "en" ? "Oldest" : "Más antiguas"}</option>
              <option value="priority">
                {language === "en" ? "Highest priority" : "Mayor prioridad"}
              </option>
            </Select>
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-150/40 dark:border-slate-800/30 animate-in fade-in duration-300">
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 mr-1">
            {t("requests.activeFilters")}
          </span>
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
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1 py-1">
              {t("requests.table.status")}: {statusTranslations[statusFilter] || statusFilter}
              <button
                onClick={() => setStatusFilter("all")}
                className="hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-full p-0.5 ml-1 transition-colors cursor-pointer"
                title={language === "en" ? "Remove status filter" : "Quitar filtro de estado"}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {priorityFilter !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1 py-1">
              {t("requests.table.priority")}:{" "}
              {priorityTranslations[priorityFilter] || priorityFilter}
              <button
                onClick={() => setPriorityFilter("all")}
                className="hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-full p-0.5 ml-1 transition-colors cursor-pointer"
                title={language === "en" ? "Remove priority filter" : "Quitar filtro de prioridad"}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
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
  );
}
