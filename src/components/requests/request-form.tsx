"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SolicitudFormData, requestSchema } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Request } from "@/lib/types";

interface RequestFormProps {
  initialData?: Request;
  onSubmit: (data: SolicitudFormData) => Promise<void>;
  isLoading?: boolean;
}

export function RequestForm({ initialData, onSubmit, isLoading }: RequestFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<SolicitudFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      priority: initialData?.priority || "medium",
      requester: initialData?.requester || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">Título de la Solicitud</label>
          <Input
            {...register("title")}
            id="title"
            placeholder="Ej. Renovación de equipo de cómputo"
            disabled={isLoading || !!initialData}
            className={errors.title ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.title && <p className="mt-1.5 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="requester" className="block text-sm font-medium text-gray-700 mb-1.5">Solicitante</label>
          <Input
            {...register("requester")}
            id="requester"
            placeholder="Nombre completo"
            disabled={isLoading || !!initialData}
            className={errors.requester ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.requester && <p className="mt-1.5 text-sm text-red-600">{errors.requester.message}</p>}
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1.5">Prioridad</label>
          <Select {...register("priority")} id="priority" disabled={isLoading}>
            <option value="low">Baja - Puede esperar</option>
            <option value="medium">Media - Requiere atención pronto</option>
            <option value="high">Alta - Urgente</option>
            <option value="critical">Crítica - Acción Inmediata</option>
          </Select>
          {errors.priority && <p className="mt-1.5 text-sm text-red-600">{errors.priority.message}</p>}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">Categoría</label>
          <Input
            {...register("category")}
            id="category"
            placeholder="Ej. Hardware, Software, RRHH"
            disabled={isLoading || !!initialData}
            className={errors.category ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.category && <p className="mt-1.5 text-sm text-red-600">{errors.category.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">Descripción Detallada</label>
          <Textarea
            {...register("description")}
            id="description"
            placeholder="Proporciona todos los detalles necesarios para evaluar tu solicitud..."
            disabled={isLoading}
            className={errors.description ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.description && <p className="mt-1.5 text-sm text-red-600">{errors.description.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Procesando..." : initialData ? "Guardar Cambios" : "Crear Solicitud"}
        </Button>
      </div>
    </form>
  );
}
