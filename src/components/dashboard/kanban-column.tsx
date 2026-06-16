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
}

export function KanbanColumn({ id, title, requests }: KanbanColumnProps) {
  const { t, language } = useLanguage();
  const isClosedColumn = id === "closed";
  const displayRequests = isClosedColumn ? requests.slice(0, 5) : requests;
  const hasMoreClosed = isClosedColumn && requests.length > 5;

  const COLUMN_COLORS: Record<string, string> = {
    pending: "bg-amber-50/50 border-amber-200/60",
    in_review: "bg-purple-50/50 border-purple-200/60",
    approved: "bg-emerald-50/50 border-emerald-200/60",
    rejected: "bg-rose-50/50 border-rose-200/60",
    closed: "bg-slate-100/50 border-slate-300/60",
  };

  const HEADER_COLORS: Record<string, string> = {
    pending: "bg-amber-100/80 text-amber-900",
    in_review: "bg-purple-100/80 text-purple-900",
    approved: "bg-emerald-100/80 text-emerald-900",
    rejected: "bg-rose-100/80 text-rose-900",
    closed: "bg-slate-200/80 text-slate-900",
  };

  return (
    <div className={`flex flex-col rounded-2xl min-w-[320px] w-[320px] shadow-sm snap-center self-start max-h-[650px] border ${COLUMN_COLORS[id] || "bg-gray-100/50 border-gray-200/60"}`}>
      <div className={`p-4 border-b border-black/5 flex justify-between items-center rounded-t-2xl sticky top-0 z-10 backdrop-blur-md ${HEADER_COLORS[id] || "bg-white/70"}`}>
        <h3 className="font-bold">{title}</h3>
        <span className="text-xs font-bold bg-white/60 py-1 px-2.5 rounded-full shadow-sm">
          {requests.length}
        </span>
      </div>
      
      <Droppable droppableId={id}>
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
