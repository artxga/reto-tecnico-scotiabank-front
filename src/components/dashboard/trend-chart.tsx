"use client";

import { Request } from "@/lib/types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface TrendChartProps {
  requests: Request[];
}

export function TrendChart({ requests }: TrendChartProps) {
  const { t, language } = useLanguage();

  // Generate data for the last 7 days dynamically
  const getLast7DaysData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateLabel = d.toLocaleDateString(language === "en" ? "en-US" : "es-ES", {
        day: "numeric",
        month: "short",
      });
      const dateKey = d.toISOString().split("T")[0];

      // Count requests created on this day
      const count = requests.filter((r) => r.creationDate.startsWith(dateKey)).length;
      data.push({
        name: dateLabel,
        cantidad: count,
      });
    }
    return data;
  };

  const data = getLast7DaysData();
  const totalInLast7Days = data.reduce((acc, curr) => acc + curr.cantidad, 0);

  return (
    <div className="rounded-2xl border border-white dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 shadow-sm transition-all hover:shadow-md flex flex-col h-[320px]">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-indigo-500" />
            {t("dashboard.charts.trendTitle")}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {t("dashboard.charts.trendSubtitle", { count: totalInLast7Days })}
          </p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0 text-[10px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255,255,255,0.06)"
              className="dark:stroke-slate-800/40"
            />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
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
              itemStyle={{ color: "#4f46e5", fontWeight: "bold" }}
              labelStyle={{ fontWeight: "bold", fontSize: "11px", marginBottom: "4px" }}
            />
            <Area
              type="monotone"
              dataKey="cantidad"
              stroke="#6366f1"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorTrend)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
