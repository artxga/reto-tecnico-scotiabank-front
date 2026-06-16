"use client";

import { Request } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { FolderKanban } from "lucide-react";

interface CategoryChartProps {
  requests: Request[];
}

const COLORS = [
  "#3b82f6", // Blue (Hardware)
  "#8b5cf6", // Purple (Accesos)
  "#ec4899", // Pink (Software)
  "#10b981", // Emerald (Infraestructura)
  "#f59e0b", // Amber (Recursos Humanos)
  "#64748b"  // Slate (Otros)
];

export function CategoryChart({ requests }: CategoryChartProps) {
  // Process data to count requests per category
  const getCategoryData = () => {
    const categories: Record<string, number> = {};
    requests.forEach((r) => {
      const cat = r.category || "Otros";
      categories[cat] = (categories[cat] || 0) + 1;
    });

    return Object.entries(categories)
      .map(([key, value]) => ({
        name: key,
        cantidad: value,
      }))
      .sort((a, b) => b.cantidad - a.cantidad);
  };

  const data = getCategoryData();

  return (
    <div className="rounded-2xl border border-white dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 shadow-sm transition-all hover:shadow-md flex flex-col h-[320px]">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FolderKanban className="h-4 w-4 text-blue-500" />
            Distribución por Categoría
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Volumen de solicitudes según área temática.
          </p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0 text-[10px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.06)" className="dark:stroke-slate-800/40" />
            <XAxis 
              type="number"
              stroke="#94a3b8" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <YAxis 
              type="category"
              dataKey="name" 
              stroke="#94a3b8" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
              width={75}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                color: "#1e293b",
              }}
              cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
            />
            <Bar 
              dataKey="cantidad" 
              radius={[0, 6, 6, 0]}
              barSize={12}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
