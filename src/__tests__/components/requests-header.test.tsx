import { render, screen, fireEvent } from "@testing-library/react";
import { RequestsHeader } from "@/components/requests/requests-header";

jest.mock("@/components/providers/language-provider", () => ({
  useLanguage: () => ({ t: (k: string) => k, language: "en" }),
}));

describe("RequestsHeader", () => {
  it("renders correctly and interacts with buttons", () => {
    const mockOnExport = jest.fn();
    const mockSetViewMode = jest.fn();

    render(
      <RequestsHeader
        onExportCSV={mockOnExport}
        exportDisabled={false}
        viewMode="list"
        setViewMode={mockSetViewMode}
      />,
    );

    expect(screen.getByText("requests.title")).toBeInTheDocument();

    const exportBtn = screen.getByText("requests.exportCSV");
    fireEvent.click(exportBtn);
    expect(mockOnExport).toHaveBeenCalled();

    const kanbanBtn = screen.getByTitle("Kanban View");
    fireEvent.click(kanbanBtn);
    expect(mockSetViewMode).toHaveBeenCalledWith("kanban");

    const listBtn = screen.getByTitle("List View");
    fireEvent.click(listBtn);
    expect(mockSetViewMode).toHaveBeenCalledWith("list");
  });

  it("disables export button when exportDisabled is true", () => {
    render(
      <RequestsHeader
        onExportCSV={jest.fn()}
        exportDisabled={true}
        viewMode="list"
        setViewMode={jest.fn()}
      />,
    );

    const exportBtn = screen.getByText("requests.exportCSV");
    expect(exportBtn).toBeDisabled();
  });
});
