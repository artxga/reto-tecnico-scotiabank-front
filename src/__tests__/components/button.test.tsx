import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  it("renderiza el texto del botón", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("aplica la variante 'danger'", () => {
    const { container } = render(<Button variant="danger">Eliminar</Button>);
    expect(container.firstChild).toHaveClass("bg-red-600");
  });

  it("está deshabilitado cuando se pasa el prop disabled", () => {
    render(<Button disabled>No click</Button>);
    expect(screen.getByRole("button", { name: /no click/i })).toBeDisabled();
  });
});
