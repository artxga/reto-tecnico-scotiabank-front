"use client";

import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Request } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar, User } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface KanbanCardProps {
  request: Request;
  index: number;
}

export function KanbanCard({ request, index }: KanbanCardProps) {
  const { language } = useLanguage();

  const translateCategory = (cat: string) => {
    const map: Record<string, string> = {
      "Hardware": language === "en" ? "Hardware" : "Hardware",
      "Accesos": language === "en" ? "Access" : "Accesos",
      "Software": language === "en" ? "Software" : "Software",
      "Infraestructura": language === "en" ? "Infrastructure" : "Infraestructura",
      "Recursos Humanos": language === "en" ? "Human Resources" : "Recursos Humanos",
      "Otros": language === "en" ? "Others" : "Otros",
    };
    return map[cat] || cat;
  };
  return (
    <Draggable draggableId={String(request.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white dark:bg-slate-900 p-4 rounded-xl border shadow-sm group transition-all select-none ${
            snapshot.isDragging 
              ? "shadow-xl border-indigo-300 ring-2 ring-indigo-500/20 rotate-2 scale-105 z-50 relative" 
              : "border-gray-200/80 hover:border-gray-300 hover:shadow-md"
          }`}
          style={provided.draggableProps.style}
        >
          <div className="flex flex-col gap-2 mb-3">
            <div className="flex justify-between items-start gap-2">
              <Link 
                href={`/requests/${request.id}`} 
                className="font-semibold text-gray-900 text-sm leading-tight hover:text-indigo-600 transition-colors line-clamp-2"
              >
                {request.title}
              </Link>
            </div>
            <div>
              <Badge variant={request.priority} />
            </div>
          </div>
          
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <User className="h-3.5 w-3.5 text-gray-400" />
              <span className="truncate">{request.requester}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-450 dark:text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>{new Date(request.creationDate).toLocaleDateString(language === "en" ? "en-US" : "es-ES")}</span>
              </div>
              <span className="text-[10px] font-medium bg-gray-100 text-gray-650 px-2 py-0.5 rounded-full truncate max-w-[80px]" title={translateCategory(request.category)}>
                {translateCategory(request.category)}
              </span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
