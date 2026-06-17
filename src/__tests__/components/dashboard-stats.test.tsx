import { render, screen } from "@testing-library/react";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { LanguageProvider } from "@/components/providers/language-provider";
import { Request } from "@/lib/types";

const mockRequests: Request[] = [
  {
    id: "1",
    title: "Req 1",
    description: "Desc 1",
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
    description: "Desc 2",
    status: "approved",
    priority: "high",
    category: "Software",
    requester: "Jane",
    creationDate: "2023-01-02T10:00:00Z",
    lastChangeDate: "2023-01-02T10:00:00Z",
  },
];

describe("DashboardStats", () => {
  it("renders correctly with requests", () => {
    render(
      <LanguageProvider>
        <DashboardStats requests={mockRequests} />
      </LanguageProvider>,
    );

    // total is 2
    expect(screen.getByText("2")).toBeInTheDocument();

    // The number 1 should appear for pending and approved.
    const ones = screen.getAllByText("1");
    expect(ones.length).toBeGreaterThanOrEqual(2);

    // The number 0 should appear for in_review, rejected, closed
    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBeGreaterThanOrEqual(3);
  });
});
