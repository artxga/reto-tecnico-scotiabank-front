describe("Requests Inbox", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/requests");
  });

  it("renders the requests inbox page", () => {
    cy.contains(/Bandeja de Solicitudes|Requests Inbox/i, {
      timeout: 10000,
    }).should("be.visible");
  });

  it("displays a search input", () => {
    // Wait for page to load
    cy.contains(/Bandeja de Solicitudes|Requests Inbox/i, {
      timeout: 10000,
    }).should("be.visible");

    cy.get("#search").first().should("be.visible");
  });

  it("shows request items after loading", () => {
    // Wait for requests to load (the API has an 800ms delay)
    cy.get("table tbody tr", { timeout: 10000 }).should("have.length.greaterThan", 0);
  });

  it("navigates to new request page", () => {
    cy.contains(/Nueva Solicitud|New Request/i, { timeout: 10000 })
      .first()
      .click();
    cy.url().should("include", "/requests/new");
  });

  it("has CSV export button", () => {
    cy.contains(/Exportar CSV|Export CSV/i, { timeout: 10000 }).should("be.visible");
  });
});
