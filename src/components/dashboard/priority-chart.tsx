"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Request } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";

interface PriorityChartProps {
  requests: Request[];
}

const PRIORITY_COLORS: Record<string, string> = {
  low: "#0f766e", // teal-700
  medium: "#c2410c", // orange-700
  high: "#b91c1c", // red-700
  critical: "#991b1b", // red-800
};

export function PriorityChart({ requests }: PriorityChartProps) {
  const router = useRouter();
  const { t, language } = useLanguage();

  const localPriorityLabels: Record<string, string> = {
    low: language === "en" ? "Low" : "Baja",
    medium: language === "en" ? "Medium" : "Media",
    high: language === "en" ? "High" : "Alta",
    critical: language === "en" ? "Critical" : "Crítica",
  };

  const data = Object.keys(localPriorityLabels).map((key) => ({
    key,
    name: localPriorityLabels[key],
    value: requests.filter((r) => r.priority === key).length,
    color: PRIORITY_COLORS[key],
  }));

  return (
    <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white rounded-2xl p-6 shadow-sm h-full flex flex-col hover:shadow-md transition-shadow">
      <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
        {t("dashboard.charts.priorityTitle")}
      </h3>
      <div className="flex-1 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 13, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b" }}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: "#f8fafc", radius: 8 }}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
              }}
              itemStyle={{ fontWeight: "bold" }}
            />
            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
              maxBarSize={45}
              onClick={(entry) => {
                if (entry && entry.key) {
                  router.push(`/requests?priority=${String(entry.key)}`);
                }
              }}
              style={{ cursor: "pointer" }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
