"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Request, RequestStatus } from "@/lib/types";
import { KanbanColumn } from "./kanban-column";
import { useUpdateRequest } from "@/hooks/use-requests";
import { useToast } from "@/components/ui/toast-context";
import { useLanguage } from "@/components/providers/language-provider";

interface KanbanBoardProps {
  requests: Request[];
}

const COLUMNS: { id: RequestStatus; title: string }[] = [
  { id: "pending", title: "Pendientes" },
  { id: "in_review", title: "En Revisión" },
  { id: "approved", title: "Aprobadas" },
  { id: "rejected", title: "Rechazadas" },
  { id: "closed", title: "Cerradas" },
];

export function KanbanBoard({ requests }: KanbanBoardProps) {
  const [mounted, setMounted] = useState(false);
  const updateRequest = useUpdateRequest();
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const localColumns: { id: RequestStatus; title: string }[] = [
    { id: "pending", title: t("dashboard.stats.pending") },
    { id: "in_review", title: t("dashboard.stats.in_review") },
    { id: "approved", title: t("dashboard.stats.approved") },
    { id: "rejected", title: t("dashboard.stats.rejected") },
    { id: "closed", title: t("dashboard.stats.closed") },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevents hydration mismatch

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as RequestStatus;
    const colTitle = localColumns.find(c => c.id === newStatus)?.title || newStatus;
    
    try {
      await updateRequest.mutateAsync({ id: draggableId, data: { status: newStatus } });
      toast(language === "en" ? `Request moved to ${colTitle}` : `Solicitud movida a ${colTitle}`, "success");
    } catch (error) {
      toast(language === "en" ? "Error moving request" : "Error al mover la solicitud", "error");
    }
  };

  return (
    <div className="w-full mt-4">
      <div className="mb-4">
        <h3 className="font-bold text-gray-900 text-2xl">{t("dashboard.kanban.title")}</h3>
        <p className="text-gray-500 mt-1">{t("dashboard.kanban.subtitle")}</p>
      </div>
      
      <div className="w-full">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-5 overflow-x-auto pb-6 pt-2 snap-x hide-scrollbar items-start">
            {localColumns.map((col) => (
              <KanbanColumn 
                key={col.id} 
                id={col.id} 
                title={col.title} 
                requests={requests.filter(r => r.status === col.id).sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())} 
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
