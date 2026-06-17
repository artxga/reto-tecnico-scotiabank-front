import { render, screen } from "@testing-library/react";
import { KanbanBoard } from "@/components/dashboard/kanban-board";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Request } from "@/lib/types";

jest.mock("@/components/providers/language-provider", () => ({
  useLanguage: () => ({ t: (k: string) => k, language: "en" }),
}));

jest.mock("@/components/ui/toast-context", () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

jest.mock("@hello-pangea/dnd", () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dnd-context">{children}</div>
  ),
  Droppable: ({
    children,
  }: {
    children: (
      provided: Record<string, unknown>,
      snapshot: Record<string, unknown>,
    ) => React.ReactNode;
  }) =>
    children(
      {
        innerRef: jest.fn(),
        droppableProps: {},
        placeholder: null,
      },
      { isDraggingOver: false },
    ),
}));

// Mock the kanban-column so we don't have to test its internals here
jest.mock("@/components/dashboard/kanban-column", () => ({
  KanbanColumn: ({ id, title, requests }: { id: string; title: string; requests: Request[] }) => (
    <div data-testid={`column-${id}`}>
      <span>{title}</span>
      <span>Count: {requests.length}</span>
    </div>
  ),
}));

const queryClient = new QueryClient();

const mockRequests: Request[] = [
  {
    id: "1",
    title: "Req 1",
    description: "Desc",
    status: "pending",
    priority: "low",
    category: "Hardware",
    requester: "John",
    creationDate: "2023-01-01T10:00:00Z",
    lastChangeDate: "2023-01-01T10:00:00Z",
  },
  {
    id: "2",
    title: "Req 2",
    description: "Desc",
    status: "approved",
    priority: "high",
    category: "Software",
    requester: "Jane",
    creationDate: "2023-01-02T10:00:00Z",
    lastChangeDate: "2023-01-02T10:00:00Z",
  },
];

describe("KanbanBoard", () => {
  it("renders columns and distributes requests", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <KanbanBoard requests={mockRequests} />
      </QueryClientProvider>,
    );

    expect(screen.getByText("dashboard.kanban.title")).toBeInTheDocument();

    const pendingCol = screen.getByTestId("column-pending");
    expect(pendingCol).toHaveTextContent("Count: 1");

    const approvedCol = screen.getByTestId("column-approved");
    expect(approvedCol).toHaveTextContent("Count: 1");

    const inReviewCol = screen.getByTestId("column-in_review");
    expect(inReviewCol).toHaveTextContent("Count: 0");
  });
});
