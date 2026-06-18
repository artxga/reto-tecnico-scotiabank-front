import { render, screen, fireEvent } from "@testing-library/react";
import { RequestsFilters } from "@/components/requests/requests-filters";

jest.mock("@/components/providers/language-provider", () => ({
  useLanguage: () => ({ t: (k: string) => k, language: "en" }),
}));

describe("RequestsFilters", () => {
  it("renders and handles interactions", () => {
    const mockSetSearch = jest.fn();
    const mockSetStatusFilter = jest.fn();
    const mockSetPriorityFilter = jest.fn();
    const mockSetSortBy = jest.fn();
    const mockSetShowFilters = jest.fn();
    const mockClearAllFilters = jest.fn();

    render(
      <RequestsFilters
        search=""
        setSearch={mockSetSearch}
        statusFilter="all"
        setStatusFilter={mockSetStatusFilter}
        priorityFilter="all"
        setPriorityFilter={mockSetPriorityFilter}
        sortBy="recent"
        setSortBy={mockSetSortBy}
        showFilters={true}
        setShowFilters={mockSetShowFilters}
        clearAllFilters={mockClearAllFilters}
        activeFiltersCount={0}
        hasActiveFilters={false}
        statusTranslations={{ pending: "Pendiente" }}
        priorityTranslations={{ high: "Alta" }}
      />,
    );

    const searchInput = screen.getByPlaceholderText("requests.searchPlaceholder");
    fireEvent.change(searchInput, { target: { value: "test" } });
    expect(mockSetSearch).toHaveBeenCalledWith("test");

    const toggleFiltersBtn = screen.getByText("Filters");
    fireEvent.click(toggleFiltersBtn);
    expect(mockSetShowFilters).toHaveBeenCalledWith(false);
  });

  it("shows active filters and can clear them", () => {
    const mockClearAllFilters = jest.fn();
    const mockSetSearch = jest.fn();

    render(
      <RequestsFilters
        search="test search"
        setSearch={mockSetSearch}
        statusFilter="pending"
        setStatusFilter={jest.fn()}
        priorityFilter="high"
        setPriorityFilter={jest.fn()}
        sortBy="recent"
        setSortBy={jest.fn()}
        showFilters={false}
        setShowFilters={jest.fn()}
        clearAllFilters={mockClearAllFilters}
        activeFiltersCount={3}
        hasActiveFilters={true}
        statusTranslations={{ pending: "Pendiente" }}
        priorityTranslations={{ high: "Alta" }}
      />,
    );

    expect(screen.getByText("requests.activeFilters")).toBeInTheDocument();

    const clearBtn = screen.getByText("requests.clearFilters");
    fireEvent.click(clearBtn);
    expect(mockClearAllFilters).toHaveBeenCalled();
  });
});
