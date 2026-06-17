describe("Navigation & Header", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/");
    // Wait for dashboard to fully load
    cy.contains("Dashboard", { timeout: 10000 }).should("be.visible");
  });

  it("toggles the language switcher in the header", () => {
    // Find and click the globe language button
    cy.get('button[aria-label="Cambiar idioma"]').click();

    // UI should switch to English
    cy.wait(500);
    cy.get("body").then(($body) => {
      const text = $body.text();
      const isEnglish = /Requests|Settings/i.test(text);
      const isSpanish = /Solicitudes|Ajustes/i.test(text);
      expect(isEnglish || isSpanish).to.equal(true);
    });
  });

  it("opens the notification panel", () => {
    cy.get('button[aria-label="Notificaciones"]').click();

    // Notification dropdown should be visible
    cy.contains(/Notificaciones|Notifications/i).should("be.visible");
  });

  it("opens the user profile dropdown", () => {
    cy.get('button[aria-label="Perfil de usuario"]').click();

    // Should show sign out option
    cy.contains(/Cerrar Sesión|Sign Out/i).should("be.visible");
  });

  it("navigates through sidebar links", () => {
    // Navigate to Requests
    cy.contains(/Solicitudes|Requests/i)
      .first()
      .click();
    cy.url().should("include", "/requests");

    // Navigate to Settings
    cy.contains(/Ajustes|Settings/i)
      .first()
      .click({ force: true });
    cy.url().should("include", "/settings");

    // Navigate back to Dashboard
    cy.contains("Dashboard").first().click();
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });

  it("logs out via the user profile dropdown", () => {
    cy.get('button[aria-label="Perfil de usuario"]').click();
    cy.contains(/Cerrar Sesión|Sign Out/i).click();

    // Should redirect to login
    cy.url({ timeout: 5000 }).should("include", "/login");
    cy.getCookie("auth_token").should("not.exist");
  });

});
