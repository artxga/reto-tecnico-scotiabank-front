import { PieChart, Activity, Clock, CheckCircle, XCircle, Archive } from "lucide-react";
import { RequestStatus, Request } from "@/lib/types";
import { useLanguage } from "@/components/providers/language-provider";

interface DashboardStatsProps {
  requests: Request[];
}

export function DashboardStats({ requests }: DashboardStatsProps) {
  const { t } = useLanguage();
  const total = requests.length;

  const getCount = (status: RequestStatus) =>
    requests.filter((r) => r.status === status).length;

  const stats = [
    {
      name: t("dashboard.stats.total"),
      value: total,
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-100/50",
    },
    {
      name: t("dashboard.stats.pending"),
      value: getCount("pending"),
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-100/50",
    },
    {
      name: t("dashboard.stats.in_review"),
      value: getCount("in_review"),
      icon: PieChart,
      color: "text-purple-600",
      bg: "bg-purple-100/50",
    },
    {
      name: t("dashboard.stats.approved"),
      value: getCount("approved"),
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-100/50",
    },
    {
      name: t("dashboard.stats.rejected"),
      value: getCount("rejected"),
      icon: XCircle,
      color: "text-rose-600",
      bg: "bg-rose-100/50",
    },
    {
      name: t("dashboard.stats.closed"),
      value: getCount("closed"),
      icon: Archive,
      color: "text-slate-600 dark:text-slate-400",
      bg: "bg-white/50",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="rounded-2xl border border-white bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-4 sm:p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between gap-2">
            <h3
              className="text-xs sm:text-sm font-semibold text-gray-500 truncate"
              title={stat.name}
            >
              {stat.name}
            </h3>
            <div className={`p-1.5 sm:p-2.5 rounded-xl ${stat.bg} shrink-0`}>
              <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
            </div>
          </div>
          <p className="text-2xl sm:text-4xl font-extrabold mt-2 sm:mt-4 text-gray-900">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
