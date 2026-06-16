import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge Component", () => {
  it("renderiza el texto proporcionado como children", () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });

  it("aplica clases de variante correctamente (alta prioridad)", () => {
    const { container } = render(<Badge variant="high">Critical</Badge>);
    expect(container.firstChild).toHaveClass("bg-red-50", "text-red-700");
  });

  it("formatea el texto automáticamente si se pasa un variant válido sin children", () => {
    render(<Badge variant="in_review" />);
    expect(screen.getByText("En Revisión")).toBeInTheDocument();
  });
});
