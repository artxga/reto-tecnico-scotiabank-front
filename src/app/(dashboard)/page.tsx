"use client";

import { useRequests } from "@/hooks/use-requests";
import { Badge } from "@/components/ui/badge";
import { PieChart, Activity, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { RequestStatus } from "@/lib/types";

export default function DashboardPage() {
  const { data: requests, isLoading } = useRequests();

  if (isLoading) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  const total = requests?.length || 0;

  const getCount = (status: RequestStatus) => requests?.filter(r => r.status === status).length || 0;

  const stats = [
    { name: "Total Solicitudes", value: total, icon: Activity, color: "text-blue-600", bg: "bg-blue-100/50" },
    { name: "Pendientes", value: getCount("pending"), icon: Clock, color: "text-amber-600", bg: "bg-amber-100/50" },
    { name: "En Revisión", value: getCount("in_review"), icon: PieChart, color: "text-purple-600", bg: "bg-purple-100/50" },
    { name: "Aprobadas", value: getCount("approved"), icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100/50" },
    { name: "Rechazadas", value: getCount("rejected"), icon: XCircle, color: "text-rose-600", bg: "bg-rose-100/50" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h2>
          <p className="text-gray-500 mt-1">Resumen general del estado de las solicitudes en el sistema.</p>
        </div>
        <Link href="/requests/new" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium inline-flex items-center gap-2 transform active:scale-95">
          <Activity className="h-4 w-4" />
          Nueva Solicitud
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.name} className="rounded-2xl border border-white bg-white/70 backdrop-blur-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-500">{stat.name}</h3>
              <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-4xl font-extrabold mt-4 text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white bg-white/70 backdrop-blur-xl shadow-sm overflow-hidden transition-all duration-300">
        <div className="border-b border-gray-100/50 px-6 py-5 bg-white/50">
          <h3 className="font-semibold text-gray-900 text-lg">Actividad Reciente</h3>
        </div>
        <div className="divide-y divide-gray-100/50">
          {requests?.slice(0, 5).map((req) => (
            <div key={req.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/50 transition-colors">
              <div>
                <p className="font-semibold text-gray-900">{req.title}</p>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  <span className="font-medium">{req.requester}</span>
                  <span>•</span>
                  <span>{new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(new Date(req.creationDate))}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={req.priority} />
                <Badge variant={req.status} />
              </div>
            </div>
          ))}
          {requests?.length === 0 && (
            <div className="p-8 text-center text-gray-500">No hay solicitudes en el sistema.</div>
          )}
        </div>
        <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100/50 text-center">
          <Link href="/requests" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            Ver todas las solicitudes &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
