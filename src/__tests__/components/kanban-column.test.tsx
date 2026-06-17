import { render, screen } from "@testing-library/react";
import { KanbanColumn } from "@/components/dashboard/kanban-column";
import { Request } from "@/lib/types";

jest.mock("@/components/providers/language-provider", () => ({
  useLanguage: () => ({ t: (k: string) => k, language: "en" }),
}));

jest.mock("@hello-pangea/dnd", () => ({
  Droppable: ({ children }: { children: (provided: Record<string, unknown>, snapshot: Record<string, unknown>) => React.ReactNode }) => children({
    innerRef: jest.fn(),
    droppableProps: {},
    placeholder: null
  }, { isDraggingOver: false }),
}));

jest.mock("@/components/dashboard/kanban-card", () => ({
  KanbanCard: ({ request }: { request: Request }) => <div data-testid="kanban-card">{request.title}</div>
}));

const mockRequests: Request[] = [
  { id: "1", title: "Req 1", description: "Desc", status: "pending", priority: "low", category: "Hardware", requester: "John", creationDate: "2023-01-01T10:00:00Z", lastChangeDate: "2023-01-01T10:00:00Z" },
  { id: "2", title: "Req 2", description: "Desc", status: "pending", priority: "high", category: "Software", requester: "Jane", creationDate: "2023-01-02T10:00:00Z", lastChangeDate: "2023-01-02T10:00:00Z" },
];

describe("KanbanColumn", () => {
  it("renders correctly with requests", () => {
    render(<KanbanColumn id="pending" title="Pending" requests={mockRequests} />);
    
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument(); // length
    
    const cards = screen.getAllByTestId("kanban-card");
    expect(cards.length).toBe(2);
    expect(screen.getByText("Req 1")).toBeInTheDocument();
  });

  it("renders no requests message when empty", () => {
    render(<KanbanColumn id="approved" title="Approved" requests={[]} />);
    
    expect(screen.getByText("dashboard.kanban.noRequests")).toBeInTheDocument();
  });

  it("limits requests in closed column to 5 and shows link", () => {
    const manyRequests: Request[] = Array.from({ length: 10 }).map((_, i) => ({
      id: `${i}`, title: `Req ${i}`, description: "Desc", status: "closed", priority: "low", category: "Hardware", requester: "John", creationDate: "2023-01-01T10:00:00Z", lastChangeDate: "2023-01-01T10:00:00Z"
    }));

    render(<KanbanColumn id="closed" title="Closed" requests={manyRequests} />);
    
    const cards = screen.getAllByTestId("kanban-card");
    expect(cards.length).toBe(5); // should be sliced to 5
    expect(screen.getByText("View more requests (5 hidden)")).toBeInTheDocument();
  });
});
