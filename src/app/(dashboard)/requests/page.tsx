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

  // Read URL search params for pre-selected dashboard filters
  const initialStatus = searchParams.get("status") || "todos";
  const initialPriority = searchParams.get("priority") || "todos";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [priorityFilter, setPriorityFilter] = useState(initialPriority);
  const [sortBy, setSortBy] = useState("recent");
  const [showFilters, setShowFilters] = useState(initialStatus !== "todos" || initialPriority !== "todos");

  const statusTranslations: Record<string, string> = {
    pending: "Pendiente",
    in_review: "En Revisión",
    approved: "Aprobada",
    rejected: "Rechazada",
    closed: "Cerrada",
  };

  const priorityTranslations: Record<string, string> = {
    low: "Baja",
    medium: "Media",
    high: "Alta",
    critical: "Crítica",
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
    const headers = ["ID", "Título", "Solicitante", "Categoría", "Prioridad", "Estado", "Fecha de Creación"];
    const rows = filtered.map((req) => [
      req.id,
      `"${req.title.replace(/"/g, '""')}"`,
      `"${req.requester.replace(/"/g, '""')}"`,
      `"${req.category.replace(/"/g, '""')}"`,
      req.priority,
      req.status,
      new Date(req.creationDate).toLocaleDateString()
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `solicitudes_exportadas_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Bandeja de Solicitudes</h2>
          <p className="text-sm text-gray-500 mt-1">Busca, filtra y revisa el estado de todas las solicitudes.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={exportToCSV}
            disabled={filtered.length === 0}
            className="flex-1 sm:flex-initial justify-center btn-secondary-liquid px-4 py-2.5 rounded-xl text-sm font-medium inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </button>
          <Link 
            href="/requests/new" 
            className="flex-1 sm:flex-initial justify-center btn-primary-liquid px-5 py-2.5 rounded-xl text-sm font-medium inline-flex items-center gap-2 transform active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            Nueva Solicitud
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
              placeholder="Buscar por título o solicitante..."
              className="pl-10 text-gray-900 dark:text-white bg-white/40 dark:bg-slate-950/20 pr-10 border-gray-200 dark:border-slate-800/80 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-all h-10.5"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-semibold cursor-pointer select-none"
              >
                Limpiar
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
            <span className="text-sm">Filtros</span>
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
              <label className="text-[11px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">Estado</label>
              <Select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)} 
                className="w-full text-gray-800 dark:text-slate-200 bg-white/40 dark:bg-slate-950/20 border-gray-200 dark:border-slate-800/80 rounded-xl"
              >
                <option value="todos">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="in_review">En Revisión</option>
                <option value="approved">Aprobada</option>
                <option value="rejected">Rechazada</option>
                <option value="closed">Cerrada</option>
              </Select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">Prioridad</label>
              <Select 
                value={priorityFilter} 
                onChange={(e) => setPriorityFilter(e.target.value)} 
                className="w-full text-gray-800 dark:text-slate-200 bg-white/40 dark:bg-slate-950/20 border-gray-200 dark:border-slate-800/80 rounded-xl"
              >
                <option value="todos">Todas las prioridades</option>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">Ordenar por</label>
              <Select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                className="w-full text-gray-800 dark:text-slate-200 bg-white/40 dark:bg-slate-950/20 border-gray-200 dark:border-slate-800/80 rounded-xl"
              >
                <option value="recent">Más recientes</option>
                <option value="oldest">Más antiguas</option>
                <option value="priority">Mayor prioridad</option>
              </Select>
            </div>
          </div>
        )}

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-150/40 dark:border-slate-800/30 animate-in fade-in duration-300">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 mr-1">Filtros activos:</span>
            {search && (
              <span className="inline-flex items-center gap-1 bg-indigo-50/70 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 text-xs font-medium px-2.5 py-1 rounded-full border border-indigo-100/50 dark:border-indigo-950/50">
                Búsqueda: "{search}"
                <button
                  onClick={() => setSearch("")}
                  className="hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-full p-0.5 ml-1 transition-colors cursor-pointer"
                  title="Quitar búsqueda"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {statusFilter !== "todos" && (
              <span className="inline-flex items-center gap-1 bg-indigo-50/70 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 text-xs font-medium px-2.5 py-1 rounded-full border border-indigo-100/50 dark:border-indigo-950/50">
                Estado: {statusTranslations[statusFilter] || statusFilter}
                <button
                  onClick={() => setStatusFilter("todos")}
                  className="hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-full p-0.5 ml-1 transition-colors cursor-pointer"
                  title="Quitar filtro de estado"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {priorityFilter !== "todos" && (
              <span className="inline-flex items-center gap-1 bg-indigo-50/70 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 text-xs font-medium px-2.5 py-1 rounded-full border border-indigo-100/50 dark:border-indigo-950/50">
                Prioridad: {priorityTranslations[priorityFilter] || priorityFilter}
                <button
                  onClick={() => setPriorityFilter("todos")}
                  className="hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-full p-0.5 ml-1 transition-colors cursor-pointer"
                  title="Quitar filtro de prioridad"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300 transition-colors ml-2 cursor-pointer"
            >
              Limpiar todo
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
              <span className="font-mono bg-slate-100/80 px-2 py-0.5 rounded text-[10px] text-gray-600">{req.category}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(req.creationDate)}</span>
              </div>
              <Badge variant={req.priority} />
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white p-12 text-center text-gray-500">
            <div className="flex flex-col items-center gap-2">
              <Search className="h-8 w-8 text-gray-300" />
              <p>No se encontraron solicitudes con los filtros aplicados.</p>
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
                <th className="px-6 py-4">Título de la Solicitud</th>
                <th className="px-6 py-4">Solicitante</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Prioridad</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((req) => (
                <tr key={req.id} className="hover:bg-white/60 transition-colors group">
                  <td className="px-6 py-4 font-semibold text-gray-900 max-w-[280px] truncate" title={req.title}>{req.title}</td>
                  <td className="px-6 py-4 text-gray-600">{req.requester}</td>
                  <td className="px-6 py-4 text-gray-600">{req.category}</td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(req.creationDate)}</td>
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
                      <p>No se encontraron solicitudes con los filtros aplicados.</p>
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
