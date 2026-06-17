"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, DropResult, DragStart } from "@hello-pangea/dnd";
import { Request, RequestStatus } from "@/lib/types";
import { KanbanColumn } from "./kanban-column";
import { ALLOWED_STATUS_TRANSITIONS } from "@/lib/validations";
import { useUpdateRequest } from "@/hooks/use-requests";
import { useToast } from "@/components/ui/toast-context";
import { useLanguage } from "@/components/providers/language-provider";

interface KanbanBoardProps {
  requests: Request[];
}

export function KanbanBoard({ requests }: KanbanBoardProps) {
  const [mounted, setMounted] = useState(false);
  const [localRequests, setLocalRequests] = useState<Request[]>(requests);
  const [draggedItemStatus, setDraggedItemStatus] = useState<RequestStatus | null>(null);
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

  useEffect(() => {
    setLocalRequests(requests);
  }, [requests]);

  if (!mounted) return null; // Prevents hydration mismatch

  const onDragStart = (start: DragStart) => {
    setDraggedItemStatus(start.source.droppableId as RequestStatus);
  };

  const onDragEnd = async (result: DropResult) => {
    setDraggedItemStatus(null);
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const newStatus = destination.droppableId as RequestStatus;
    const colTitle = localColumns.find((c) => c.id === newStatus)?.title || newStatus;

    // Optimistic local update to prevent snap-back
    setLocalRequests((prev) =>
      prev.map((req) => (String(req.id) === draggableId ? { ...req, status: newStatus } : req)),
    );

    try {
      await updateRequest.mutateAsync({ id: draggableId, data: { status: newStatus } });
      toast(
        language === "en" ? `Request moved to ${colTitle}` : `Solicitud movida a ${colTitle}`,
        "success",
      );
    } catch {
      // Revert on error
      setLocalRequests(requests);
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
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="flex gap-5 overflow-x-auto pb-6 pt-2 snap-x hide-scrollbar items-start">
            {localColumns.map((col) => (
              <KanbanColumn
                key={col.id}
                id={col.id}
                title={col.title}
                requests={localRequests
                  .filter((r) => r.status === col.id)
                  .sort(
                    (a, b) =>
                      new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime(),
                  )}
                isDropDisabled={
                  draggedItemStatus
                    ? draggedItemStatus !== col.id &&
                      !(ALLOWED_STATUS_TRANSITIONS[draggedItemStatus] || []).includes(col.id)
                    : false
                }
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
