"use client";
import React, { useMemo } from "react";
import { Request } from "@/lib/types";
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Archive,
  History,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/language-provider";

interface RecentActivityProps {
  requests: Request[];
}

interface ActivityEvent {
  id: string;
  requestId: string;
  type: "create" | "update";
  title: string;
  desc: string;
  time: string;
  timestamp: number;
  color: string;
  icon: React.ElementType;
  category: string;
  priority: string;
}

export function RecentActivity({ requests }: RecentActivityProps) {
  const { t, language } = useLanguage();

  const activities = useMemo(() => {
    // Helper to format relative time
    const formatTimeAgo = (dateStr: string) => {
      try {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return t("dashboard.recentActivity.time.now");
        if (diffMins < 60) return t("dashboard.recentActivity.time.mins", { count: diffMins });
        if (diffHours < 24)
          return diffHours === 1
            ? t("dashboard.recentActivity.time.hour")
            : t("dashboard.recentActivity.time.hours", { count: diffHours });
        if (diffDays < 30)
          return diffDays === 1
            ? t("dashboard.recentActivity.time.day")
            : t("dashboard.recentActivity.time.days", { count: diffDays });
        return date.toLocaleDateString(language === "en" ? "en-US" : "es-ES", {
          day: "numeric",
          month: "short",
        });
      } catch {
        return language === "en" ? "Recently" : "Recientemente";
      }
    };

    const list: ActivityEvent[] = [];

    const localStatusTranslations: Record<string, string> = {
      pending: language === "en" ? "Pending" : "Pendiente",
      in_review: language === "en" ? "In Review" : "En Revisión",
      approved: language === "en" ? "Approved" : "Aprobada",
      rejected: language === "en" ? "Rejected" : "Rechazada",
      closed: language === "en" ? "Closed" : "Cerrada",
    };

    requests.forEach((r) => {
      // 1. Every request has a creation event
      list.push({
        id: `${r.id}-create`,
        requestId: String(r.id),
        type: "create",
        title: t("dashboard.recentActivity.newEvent"),
        desc: t("dashboard.recentActivity.createdDesc", { requester: r.requester, title: r.title }),
        time: formatTimeAgo(r.creationDate),
        timestamp: new Date(r.creationDate).getTime(),
        color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30",
        icon: PlusCircle,
        category: r.category || "General",
        priority: r.priority,
      });

      // 2. If lastChangeDate is different from creationDate, add update event
      if (r.lastChangeDate && r.lastChangeDate !== r.creationDate) {
        let title = t("dashboard.recentActivity.requestEdited");
        let desc = t("dashboard.recentActivity.editedDesc", { title: r.title });
        let icon = Clock;
        let color = "text-amber-500 bg-amber-50 dark:bg-amber-950/30";

        if (r.status !== "pending") {
          title = t("dashboard.recentActivity.statusUpdated");
          desc = t("dashboard.recentActivity.statusDesc", {
            title: r.title,
            status: localStatusTranslations[r.status] || r.status,
          });
          if (r.status === "approved") {
            icon = CheckCircle2;
            color = "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30";
          } else if (r.status === "rejected") {
            icon = XCircle;
            color = "text-rose-500 bg-rose-50 dark:bg-rose-950/30";
          } else if (r.status === "closed") {
            icon = Archive;
            color = "text-slate-500 bg-slate-100 dark:bg-slate-800/40";
          } else if (r.status === "in_review") {
            icon = Clock;
            color = "text-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-950/30";
          }
        } else {
          icon = History;
          color = "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30";
        }

        list.push({
          id: `${r.id}-update`,
          requestId: String(r.id),
          type: "update",
          title,
          desc,
          time: formatTimeAgo(r.lastChangeDate),
          timestamp: new Date(r.lastChangeDate).getTime(),
          color,
          icon,
          category: r.category || "General",
          priority: r.priority,
        });
      }
    });

    // Sort by timestamp desc and take top 8 (wider layout allows more entries)
    return list.sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);
  }, [requests, language, t]);

  return (
    <div className="rounded-2xl border border-white dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 shadow-sm transition-all hover:shadow-md flex flex-col h-auto min-h-[350px]">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <History className="h-4 w-4 text-indigo-500" />
            {t("dashboard.recentActivity.title")}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {t("dashboard.recentActivity.subtitle")}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              href={`/requests/${act.requestId}`}
              key={act.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/40 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md hover:bg-white/60 dark:bg-slate-900/50 dark:hover:bg-slate-900/50 hover:border-indigo-500/30 transition-all duration-300 group shadow-xs hover:shadow-sm"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${act.color} ring-1 ring-black/5 dark:ring-white/5 shadow-xs`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      {act.title}
                    </span>
                    <span className="hidden md:inline text-xs text-gray-450 dark:text-gray-500">
                      •
                    </span>
                    <p
                      className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-2xl"
                      title={act.desc}
                    >
                      {act.desc}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    {act.category && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-350 border border-slate-200/50 dark:border-slate-700/50">
                        {act.category}
                      </span>
                    )}
                    {act.priority && (
                      <Badge variant={act.priority} className="text-[9px] px-1.5 py-0" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-150/40 dark:border-slate-800/40">
                <span className="text-xs text-gray-450 dark:text-gray-500 font-medium">
                  {act.time}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-450 dark:text-gray-500 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-300 hidden sm:block" />
              </div>
            </Link>
          );
        })}

        {activities.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[200px] text-center text-gray-400 dark:text-gray-500 py-12">
            <History className="h-8 w-8 text-gray-300 dark:text-slate-800 mb-2" />
            <p className="text-xs">{t("dashboard.recentActivity.noActivity")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
