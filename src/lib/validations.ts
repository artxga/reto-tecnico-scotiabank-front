import { z } from "zod";

export const requestSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres").max(100, "El título no puede exceder los 100 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres").max(500, "La descripción no puede exceder los 500 caracteres"),
  category: z.string().min(2, "La categoría es obligatoria"),
  priority: z.enum(["low", "medium", "high", "critical"], {
    message: "Prioridad inválida",
  }),
  requester: z.string().min(3, "El nombre del solicitante es obligatorio"),
});

export const updatePrioritySchema = z.object({
  priority: z.enum(["low", "medium", "high", "critical"], {
    message: "Prioridad inválida",
  }),
});

export type SolicitudFormData = z.infer<typeof requestSchema>;
