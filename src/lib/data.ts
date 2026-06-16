import { Request } from "./types";

const initialData: Request[] = [
  {
    id: "1",
    title: "Renovación de equipo de cómputo",
    description: "Mi laptop actual presenta fallas constantes y lentitud. Necesito un equipo de reemplazo para poder trabajar correctamente.",
    status: "pending",
    priority: "medium",
    category: "Hardware",
    requester: "Juan Pérez",
    creationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    lastChangeDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "2",
    title: "Acceso a base de datos de pruebas",
    description: "Necesito acceso a la base de datos de QA para validar el nuevo módulo de pagos.",
    status: "approved",
    priority: "high",
    category: "Accesos",
    requester: "María García",
    creationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    lastChangeDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    id: "3",
    title: "Servidor de producción caído",
    description: "El servidor principal no responde a las peticiones, error 502 Bad Gateway continuo.",
    status: "in_review",
    priority: "critical",
    category: "Infraestructura",
    requester: "Carlos López",
    creationDate: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    lastChangeDate: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Licencia de software de diseño",
    description: "Renovación de la licencia anual para la suite de diseño requerida para el proyecto de marketing.",
    status: "rejected",
    priority: "medium",
    category: "Software",
    requester: "Ana Torres",
    creationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    lastChangeDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
  {
    id: "5",
    title: "Permiso para trabajo remoto extendido",
    description: "Solicito 2 semanas de trabajo remoto por motivos familiares fuera de la ciudad.",
    status: "closed",
    priority: "low",
    category: "Recursos Humanos",
    requester: "Luis Martínez",
    creationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    lastChangeDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
  }
];

let mockRequests = [...initialData];

export function getMockRequests() {
  return [...mockRequests].sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
}

export function addMockRequest(request: Request) {
  mockRequests.push(request);
}

export function updateMockRequest(id: string | number, updates: Partial<Request>) {
  mockRequests = mockRequests.map((req) =>
    String(req.id) === String(id) ? { ...req, ...updates, lastChangeDate: new Date().toISOString() } : req
  );
}

export function deleteMockRequest(id: string | number) {
  mockRequests = mockRequests.filter((req) => String(req.id) !== String(id));
}

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
