"use client";

import { useState } from "react";
import { useRequests } from "@/hooks/use-requests";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowUpDown, Eye, PlusCircle, Calendar } from "lucide-react";
import { Priority } from "@/lib/types";

export default function RequestsPage() {
  const { data: requests, isLoading } = useRequests();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [sortBy, setSortBy] = useState("recent");

  if (isLoading) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  let filtered = requests || [];

  if (search) {
    filtered = filtered.filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || r.requester.toLowerCase().includes(search.toLowerCase()));
  }

  if (statusFilter !== "todos") {
    filtered = filtered.filter(r => r.status === statusFilter);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Bandeja de Solicitudes</h2>
          <p className="text-sm text-gray-500 mt-1">Busca, filtra y revisa el estado de todas las solicitudes.</p>
        </div>
        <Link href="/requests/new" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium inline-flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Nueva Solicitud
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por título o solicitante..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-[180px]">
              <option value="todos">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="in_review">En Revisión</option>
              <option value="approved">Aprobada</option>
              <option value="rejected">Rechazada</option>
              <option value="closed">Cerrada</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full sm:w-[180px]">
              <option value="recent">Más recientes</option>
              <option value="oldest">Más antiguas</option>
              <option value="priority">Mayor prioridad</option>
            </Select>
          </div>
        </div>
      </div>

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
                  <td className="px-6 py-4 font-semibold text-gray-900">{req.title}</td>
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
