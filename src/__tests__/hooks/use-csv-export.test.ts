import { renderHook } from "@testing-library/react";
import { useCsvExport } from "@/hooks/use-csv-export";

describe("useCsvExport", () => {
  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should trigger a download with the correct CSV content in English", () => {
    const mockAppendChild = jest
      .spyOn(document.body, "appendChild")
      .mockImplementation((node) => node);
    const mockRemoveChild = jest
      .spyOn(document.body, "removeChild")
      .mockImplementation((node) => node);
    const mockSetAttribute = jest
      .spyOn(HTMLAnchorElement.prototype, "setAttribute")
      .mockImplementation(() => {});
    const mockClick = jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    const { result } = renderHook(() => useCsvExport());

    const params = {
      filtered: [
        {
          id: "1",
          title: "Test Title",
          requester: "John Doe",
          category: "Hardware",
          priority: "high",
          status: "pending",
          creationDate: "2023-01-01T10:00:00Z",
        },
      ],
      language: "en",
      categoryTranslations: { Hardware: "Hardware (EN)" },
      priorityTranslations: { high: "High" },
      statusTranslations: { pending: "Pending" },
    };

    result.current.exportToCSV(params);

    expect(mockSetAttribute).toHaveBeenCalledWith("href", "blob:mock-url");
    expect(mockSetAttribute).toHaveBeenCalledWith(
      "download",
      expect.stringMatching(/^exported_requests_.*\.csv$/),
    );
    expect(mockAppendChild).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
    expect(mockRemoveChild).toHaveBeenCalled();

    mockAppendChild.mockRestore();
    mockRemoveChild.mockRestore();
    mockSetAttribute.mockRestore();
    mockClick.mockRestore();
  });

  it("should trigger a download with the correct CSV content in Spanish", () => {
    const mockAppendChild = jest
      .spyOn(document.body, "appendChild")
      .mockImplementation((node) => node);
    const mockRemoveChild = jest
      .spyOn(document.body, "removeChild")
      .mockImplementation((node) => node);
    const mockSetAttribute = jest
      .spyOn(HTMLAnchorElement.prototype, "setAttribute")
      .mockImplementation(() => {});
    const mockClick = jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    const { result } = renderHook(() => useCsvExport());

    const params = {
      filtered: [],
      language: "es",
      categoryTranslations: {},
      priorityTranslations: {},
      statusTranslations: {},
    };

    result.current.exportToCSV(params);

    expect(mockSetAttribute).toHaveBeenCalledWith(
      "download",
      expect.stringMatching(/^solicitudes_exportadas_.*\.csv$/),
    );

    mockAppendChild.mockRestore();
    mockRemoveChild.mockRestore();
    mockSetAttribute.mockRestore();
    mockClick.mockRestore();
  });
});
