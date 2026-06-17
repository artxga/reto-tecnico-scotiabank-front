describe("Login Flow", () => {
  beforeEach(() => {
    cy.clearCookies();
  });

  it("redirects unauthenticated users to /login", () => {
    cy.visit("/", { failOnStatusCode: false });
    cy.url().should("include", "/login");
  });

  it("renders the login form with all expected elements", () => {
    cy.visit("/login");

    // Logo and title
    cy.contains(/Gestor de Solicitudes|Request Manager/i).should("be.visible");

    // Form fields
    cy.get("#email").should("be.visible");
    cy.get("#password").should("be.visible");

    // Submit button
    cy.get('button[type="submit"]').should("be.visible");

    // Mock credentials hint
    cy.contains("admin@scotiabank.com").should("be.visible");
    cy.contains("admin123").should("be.visible");
  });

  it("shows validation errors for empty fields", () => {
    cy.visit("/login");
    cy.get('button[type="submit"]').click();

    // Should show email and password required errors
    cy.contains(/obligatorio|required/i).should("be.visible");
  });

  it("shows validation error for invalid email format", () => {
    cy.visit("/login");
    cy.get("#email", { timeout: 8000 }).type("invalid-email");
    cy.get("#password").type("admin123");
    cy.get('button[type="submit"]').click();

    cy.contains(/no es válido|invalid/i).should("be.visible");
  });

  it("shows validation error for short password", () => {
    cy.visit("/login");
    cy.get("#email").type("admin@scotiabank.com");
    cy.get("#password").type("abc");
    cy.get('button[type="submit"]').click();

    cy.contains(/al menos 6|at least 6/i).should("be.visible");
  });

  it("shows auth error for wrong credentials", () => {
    cy.visit("/login");
    cy.get("#email").type("wrong@scotiabank.com");
    cy.get("#password").type("wrongpassword");
    cy.get('button[type="submit"]').click();

    // Wait for the simulated network delay (1200ms)
    cy.contains(/incorrectos|incorrect/i, { timeout: 5000 }).should("be.visible");
  });

  it("logs in successfully with valid mock credentials", () => {
    cy.visit("/login");
    cy.get("#email").type("admin@scotiabank.com");
    cy.get("#password").type("admin123");
    cy.get('button[type="submit"]').click();

    // Should show loading state
    cy.contains(/Iniciando sesión|Signing in/i).should("be.visible");

    // Should redirect to dashboard after login
    cy.url({ timeout: 8000 }).should("not.include", "/login");

    // Auth cookie should exist
    cy.getCookie("auth_token").should("exist");
  });

  it("redirects authenticated users away from /login", () => {
    cy.login();
    cy.visit("/login");
    cy.url({ timeout: 5000 }).should("not.include", "/login");
  });
});
