"use client";

import { useRequests } from "@/hooks/use-requests";
import { Badge } from "@/components/ui/badge";
import { PieChart, Activity, Clock, CheckCircle, XCircle, Archive } from "lucide-react";
import Link from "next/link";
import { RequestStatus } from "@/lib/types";
import { KanbanBoard } from "@/components/dashboard/kanban-board";
import { StatusChart } from "@/components/dashboard/status-chart";
import { PriorityChart } from "@/components/dashboard/priority-chart";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data: requests, isLoading } = useRequests();

  if (isLoading) {
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
            <div key={i} className="rounded-2xl border border-white bg-white/70 backdrop-blur-xl p-4 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-8 w-8 rounded-xl shrink-0" />
              </div>
              <Skeleton className="h-8 w-1/3" />
            </div>
          ))}
        </div>

        {/* Kanban Board Skeleton */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[350px]" />
          </div>
          <div className="flex gap-5 overflow-hidden pb-6 pt-2 items-start">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 space-y-4 min-w-[280px] w-[280px] sm:min-w-[320px] sm:w-[320px] shrink-0">
                <div className="flex justify-between items-center pb-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-5 w-8 rounded-full" />
                </div>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-xl border border-gray-250 shadow-xs space-y-3">
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-3.5 w-1/4" />
                    <div className="border-t border-gray-100 pt-2.5 flex justify-between items-center">
                      <Skeleton className="h-3.5 w-1/2" />
                      <Skeleton className="h-3.5 w-1/3" />
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-250 shadow-xs space-y-3">
                    <Skeleton className="h-4 w-3/5" />
                    <Skeleton className="h-3.5 w-1/4" />
                    <div className="border-t border-gray-100 pt-2.5 flex justify-between items-center">
                      <Skeleton className="h-3.5 w-1/3" />
                      <Skeleton className="h-3.5 w-1/2" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const total = requests?.length || 0;

  const getCount = (status: RequestStatus) => requests?.filter(r => r.status === status).length || 0;

  const stats = [
    { name: "Total Solicitudes", value: total, icon: Activity, color: "text-blue-600", bg: "bg-blue-100/50" },
    { name: "Pendientes", value: getCount("pending"), icon: Clock, color: "text-amber-600", bg: "bg-amber-100/50" },
    { name: "En Revisión", value: getCount("in_review"), icon: PieChart, color: "text-purple-600", bg: "bg-purple-100/50" },
    { name: "Aprobadas", value: getCount("approved"), icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100/50" },
    { name: "Rechazadas", value: getCount("rejected"), icon: XCircle, color: "text-rose-600", bg: "bg-rose-100/50" },
    { name: "Cerradas", value: getCount("closed"), icon: Archive, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100/50" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Resumen general del estado de las solicitudes en el sistema.</p>
        </div>
        <Link href="/requests/new" className="w-full sm:w-auto justify-center btn-primary-liquid px-5 py-2.5 rounded-xl text-sm font-medium inline-flex items-center gap-2 transform active:scale-95">
          <Activity className="h-4 w-4" />
          Nueva Solicitud
        </Link>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.name} className="rounded-2xl border border-white bg-white/70 backdrop-blur-xl p-4 sm:p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-500 truncate" title={stat.name}>{stat.name}</h3>
              <div className={`p-1.5 sm:p-2.5 rounded-xl ${stat.bg} shrink-0`}>
                <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl sm:text-4xl font-extrabold mt-2 sm:mt-4 text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="w-full">
        {requests && <KanbanBoard requests={requests} />}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 w-full">
        {requests && <StatusChart requests={requests} />}
        {requests && <PriorityChart requests={requests} />}
      </div>
    </div>
  );
}
