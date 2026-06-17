"use client";

import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Request, RequestStatus } from "@/lib/types";
import { KanbanCard } from "./kanban-card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface KanbanColumnProps {
  id: RequestStatus;
  title: string;
  requests: Request[];
  isDropDisabled?: boolean;
}

export function KanbanColumn({ id, title, requests, isDropDisabled }: KanbanColumnProps) {
  const { t, language } = useLanguage();
  const isClosedColumn = id === "closed";
  const displayRequests = isClosedColumn ? requests.slice(0, 5) : requests;
  const hasMoreClosed = isClosedColumn && requests.length > 5;

  const COLUMN_COLORS: Record<string, string> = {
    pending: "bg-amber-50/50 border-amber-200/60 dark:bg-amber-950/20 dark:border-amber-900/40",
    in_review:
      "bg-purple-50/50 border-purple-200/60 dark:bg-purple-950/20 dark:border-purple-900/40",
    approved:
      "bg-emerald-50/50 border-emerald-200/60 dark:bg-emerald-950/20 dark:border-emerald-900/40",
    rejected: "bg-rose-50/50 border-rose-200/60 dark:bg-rose-950/20 dark:border-rose-900/40",
    closed: "bg-slate-100/50 border-slate-300/60 dark:bg-slate-900/50 dark:border-slate-800/60",
  };

  const HEADER_COLORS: Record<string, string> = {
    pending:
      "bg-amber-100/80 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-900/50",
    in_review:
      "bg-purple-100/80 text-purple-900 dark:bg-purple-900/30 dark:text-purple-200 dark:border-purple-900/50",
    approved:
      "bg-emerald-100/80 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-900/50",
    rejected:
      "bg-rose-100/80 text-rose-900 dark:bg-rose-900/30 dark:text-rose-200 dark:border-rose-900/50",
    closed:
      "bg-slate-200/80 text-slate-900 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/50",
  };

  return (
    <div
      className={`flex flex-col rounded-2xl min-w-[320px] w-[320px] shadow-sm snap-center self-start max-h-[650px] border transition-opacity duration-300 ${COLUMN_COLORS[id] || "bg-gray-100/50 border-gray-200/60"} ${
        isDropDisabled ? "opacity-50 grayscale-[50%]" : "opacity-100"
      }`}
    >
      <div
        className={`p-4 border-b border-black/5 flex justify-between items-center rounded-t-2xl sticky top-0 z-10 backdrop-blur-md ${HEADER_COLORS[id] || "bg-white/70 dark:bg-slate-900/60"}`}
      >
        <h3 className="font-bold">{title}</h3>
        <span className="text-xs font-bold bg-white/60 dark:bg-slate-900/50 py-1 px-2.5 rounded-full shadow-sm">
          {requests.length}
        </span>
      </div>

      <Droppable droppableId={id} isDropDisabled={isDropDisabled}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 min-h-[150px] overflow-y-auto transition-colors hide-scrollbar ${
              snapshot.isDraggingOver ? "bg-indigo-50/60" : ""
            }`}
          >
            <div className="space-y-3">
              {displayRequests.map((req, index) => (
                <KanbanCard key={req.id} request={req} index={index} />
              ))}
            </div>
            {provided.placeholder}

            {hasMoreClosed && (
              <div className="mt-4 pb-2 text-center">
                <Link
                  href="/requests"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100"
                >
                  {language === "en"
                    ? `View more requests (${requests.length - 5} hidden)`
                    : `Ver más solicitudes (${requests.length - 5} ocultas)`}{" "}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}

            {displayRequests.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 text-gray-400 text-xs border-2 border-dashed border-gray-200/50 dark:border-slate-800/40 rounded-lg mt-2">
                {t("dashboard.kanban.noRequests")}
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
