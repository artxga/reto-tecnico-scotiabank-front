import { solicitudSchema, updatePrioritySchema } from "@/lib/validations";

describe("Validaciones de Solicitud (Zod)", () => {
  it("debe validar un payload correcto", () => {
    const validData = {
      title: "Título de prueba válido",
      description: "Descripción detallada de la solicitud de prueba.",
      category: "Prueba de categoría",
      priority: "high",
      requester: "Juan Pérez"
    };

    const result = solicitudSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("debe fallar si el título es menor a 5 caracteres", () => {
    const invalidData = {
      title: "No",
      description: "Descripción detallada de la solicitud de prueba.",
      category: "Prueba de categoría",
      priority: "high",
      requester: "Juan Pérez"
    };

    const result = solicitudSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("El título debe tener al menos 5 caracteres");
    }
  });

  it("debe validar la prioridad en el esquema de actualización", () => {
    expect(updatePrioritySchema.safeParse({ priority: "medium" }).success).toBe(true);
    expect(updatePrioritySchema.safeParse({ priority: "urgente" }).success).toBe(false);
  });
});
