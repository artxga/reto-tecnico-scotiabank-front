"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Request, RequestStatus } from "@/lib/types";
import { KanbanColumn } from "./kanban-column";
import { useUpdateRequest } from "@/hooks/use-requests";
import { useToast } from "@/components/ui/toast-context";

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
    
    try {
      await updateRequest.mutateAsync({ id: draggableId, data: { status: newStatus } });
      toast(`Solicitud movida a ${COLUMNS.find(c => c.id === newStatus)?.title}`, "success");
    } catch (error) {
      toast("Error al mover la solicitud", "error");
    }
  };

  return (
    <div className="w-full mt-4">
      <div className="mb-4">
        <h3 className="font-bold text-gray-900 text-2xl">Tablero de Trabajo</h3>
        <p className="text-gray-500 mt-1">Arrastra y suelta las solicitudes para cambiar su estado en tiempo real.</p>
      </div>
      
      <div className="w-full">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-5 overflow-x-auto pb-6 pt-2 snap-x hide-scrollbar items-start">
            {COLUMNS.map((col) => (
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
