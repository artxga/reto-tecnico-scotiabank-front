describe("Request CRUD Flow (E2E)", () => {
  beforeEach(() => {
    cy.login();
  });

  it("creates a new request via the form and verifies it appears in the list", () => {
    const uniqueTitle = `E2E Test ${Date.now()}`;
    const description =
      "Solicitud creada automáticamente por Cypress E2E para verificar el flujo completo de creación.";

    // 1. Navigate to new request form
    cy.visit("/requests/new");
    cy.contains(/Nueva Solicitud|New Request/i, { timeout: 10000 }).should(
      "be.visible"
    );

    // 2. Fill the form fields (matching the actual form IDs)
    cy.get("#title").clear({ timeout: 10000 }).type(uniqueTitle);
    cy.get("#requester").clear().type("Cypress Tester");
    cy.get("#priority").select("high");
    cy.get("#category").clear().type("Testing");
    cy.get("#description").clear().type(description);

    // 3. Submit the form
    cy.get('button[type="submit"]').click();

    // 4. Should redirect to the requests list after successful creation
    cy.url({ timeout: 10000 }).should("include", "/requests");
    cy.url().should("not.include", "/new");

    // 5. The new request should appear in the inbox
    cy.get(".hidden.md\\:block table")
      .contains(uniqueTitle, { timeout: 10000 })
      .should("be.visible");
  });

  it("views a request detail page from the inbox", () => {
    cy.visit("/requests");

    // Wait for requests to render
    cy.get("table tbody tr", { timeout: 10000 }).should("have.length.gt", 0);

    // Click on the first request row link
    cy.get("table tbody tr").first().find("a").first().click();

    // Should navigate to a detail page URL
    cy.url().should("match", /\/requests\/[a-zA-Z0-9-]+/);
  });
});
