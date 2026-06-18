import { z } from "zod";
import { CATEGORIES, PRIORITIES, REQUEST_STATUSES } from "./types";

export const requestSchema = z.object({
  title: z
    .string()
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(100, "El título no puede exceder los 100 caracteres"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede exceder los 500 caracteres"),
  category: z.enum(CATEGORIES, {
    message: "La categoría es obligatoria",
  }),
  priority: z.enum(PRIORITIES, {
    message: "Prioridad inválida",
  }),
  status: z
    .enum(REQUEST_STATUSES, {
      message: "Estado inválido",
    })
    .optional(),
  requester: z.string().min(3, "El nombre del solicitante es obligatorio"),
});

export const updatePrioritySchema = z.object({
  priority: z.enum(PRIORITIES, {
    message: "Prioridad inválida",
  }),
});

export const loginSchema = z.object({
  email: z.string().min(1, "login.emailRequired").email("login.invalidEmail"),
  password: z.string().min(1, "login.passwordRequired").min(6, "login.passwordMin"),
});

export type SolicitudFormData = z.infer<typeof requestSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;

export const ALLOWED_STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ["in_review"],
  in_review: ["approved", "rejected"],
  approved: ["closed", "in_review"],
  rejected: ["closed"],
  closed: [],
};
