import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RequestForm } from "@/components/requests/request-form";

describe("RequestForm Component", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza correctamente todos los campos", () => {
    render(<RequestForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/Título de la Solicitud/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Solicitante/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prioridad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Categoría/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descripción Detallada/i)).toBeInTheDocument();
  });

  it("muestra errores de validación si se envía vacío (Validación de campos obligatorios)", async () => {
    render(<RequestForm onSubmit={mockOnSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: /Crear Solicitud/i }));

    await waitFor(() => {
      expect(screen.getByText(/El título debe tener al menos 5 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText(/El nombre del solicitante es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/La categoría es obligatoria/i)).toBeInTheDocument();
      expect(
        screen.getByText(/La descripción debe tener al menos 10 caracteres/i),
      ).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("envía el formulario correctamente con datos válidos (Interacción de usuario)", async () => {
    render(<RequestForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/Título de la Solicitud/i), {
      target: { value: "Nueva Laptop" },
    });
    fireEvent.change(screen.getByLabelText(/Solicitante/i), { target: { value: "Juan Pérez" } });
    fireEvent.change(screen.getByLabelText(/Categoría/i), { target: { value: "Hardware" } });
    fireEvent.change(screen.getByLabelText(/Descripción Detallada/i), {
      target: { value: "Mi laptop se malogró y necesito una urgente para trabajar." },
    });
    fireEvent.change(screen.getByLabelText(/Prioridad/i), { target: { value: "high" } });

    fireEvent.click(screen.getByRole("button", { name: /Crear Solicitud/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Nueva Laptop",
          requester: "Juan Pérez",
          category: "Hardware",
          description: "Mi laptop se malogró y necesito una urgente para trabajar.",
          priority: "high",
        }),
        expect.anything(),
      );
    });
  });

  it("deshabilita los inputs durante el estado de carga (Estados de carga)", () => {
    render(<RequestForm onSubmit={mockOnSubmit} isLoading={true} />);
    expect(screen.getByLabelText(/Título de la Solicitud/i)).toBeDisabled();
    expect(screen.getByLabelText(/Categoría/i)).toBeDisabled();
    expect(screen.getByRole("button", { name: /Procesando.../i })).toBeDisabled();
  });
});
