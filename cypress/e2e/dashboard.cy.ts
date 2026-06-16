describe("Dashboard", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/");
  });

  it("loads the dashboard page with header", () => {
    // Header should be visible
    cy.get("header").should("be.visible");

    // Dashboard title should be visible (after data loads)
    cy.contains("Dashboard", { timeout: 10000 }).should("be.visible");
  });

  it("displays stats cards after loading", () => {
    // Wait for skeleton to disappear and stats to render
    cy.contains(/Total|Pendientes|Pending/i, { timeout: 10000 }).should(
      "be.visible"
    );
  });

  it("displays charts section", () => {
    // Wait for data to load then check charts
    cy.contains(/Distribución|Distribution|Estado|Status/i, {
      timeout: 10000,
    }).should("be.visible");
  });

  it("displays recent activity section", () => {
    cy.contains(/Actividad Reciente|Recent Activity/i, {
      timeout: 10000,
    }).should("be.visible");
  });

  it("navigates to requests page via sidebar", () => {
    cy.contains(/Solicitudes|Requests/i, { timeout: 10000 })
      .first()
      .click();
    cy.url().should("include", "/requests");
  });

  it("navigates to new request page via button", () => {
    // Wait for data to load and button to appear
    cy.contains(/Nueva Solicitud|New Request/i, { timeout: 10000 })
      .first()
      .click();
    cy.url().should("include", "/requests/new");
  });
});
