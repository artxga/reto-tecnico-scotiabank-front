"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Request } from "@/lib/types";

interface StatusChartProps {
  requests: Request[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#d97706", // amber-600
  in_review: "#9333ea", // purple-600
  approved: "#059669", // emerald-600
  rejected: "#e11d48", // rose-600
  closed: "#475569", // slate-600
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  in_review: "En Revisión",
  approved: "Aprobada",
  rejected: "Rechazada",
  closed: "Cerrada",
};

export function StatusChart({ requests }: StatusChartProps) {
  const data = Object.keys(STATUS_LABELS).map((key) => ({
    name: STATUS_LABELS[key],
    value: requests.filter((r) => r.status === key).length,
    color: STATUS_COLORS[key],
  })).filter(d => d.value > 0);

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl p-6 shadow-sm h-full flex flex-col hover:shadow-md transition-shadow">
      <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">Distribución por Estado</h3>
      <div className="flex-1 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
              itemStyle={{ fontWeight: "bold" }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
