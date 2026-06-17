import { renderHook, waitFor } from "@testing-library/react";
import { useRequests } from "@/hooks/use-requests";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Mock fetch global para interceptar las llamadas a la API
global.fetch = jest.fn();

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Desactivar reintentos en pruebas para evitar demoras
      },
    },
  });

describe("Hooks de consumo de API (useRequests)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("obtiene la lista de solicitudes con éxito (Mocks de API y estados de éxito)", async () => {
    const mockData = [{ id: "1", title: "Test Request", priority: "high", status: "pending" }];

    // Configuramos el mock de fetch para simular respuesta exitosa
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useRequests(), { wrapper });

    // Estado inicial de carga
    expect(result.current.isLoading).toBe(true);

    // Esperar a que la petición termine
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Validar datos
    expect(result.current.data).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith("/api/v1/solicitudes");
  });

  it("maneja estado de error correctamente cuando falla la API (Estado de error)", async () => {
    // Configuramos el mock para simular un error 500
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useRequests(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
});
