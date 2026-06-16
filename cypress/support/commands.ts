/// <reference types="cypress" />
// ***********************************************
// Custom commands for Gestor de Solicitudes
// ***********************************************

/**
 * Login with mock credentials by setting the auth cookie directly.
 * Bypasses UI for speed in tests that don't test login itself.
 */
Cypress.Commands.add("login", () => {
  cy.setCookie("auth_token", "mock-jwt-session-token", {
    path: "/",
    sameSite: "strict",
  });
});

/**
 * Login via the UI form (for E2E login flow tests).
 */
Cypress.Commands.add(
  "loginViaUI",
  (email = "admin@scotiabank.com", password = "admin123") => {
    cy.visit("/login");
    cy.get("#email").clear().type(email);
    cy.get("#password").clear().type(password);
    cy.get('button[type="submit"]').click();
  }
);

/**
 * Logout by clearing the auth cookie.
 */
Cypress.Commands.add("logout", () => {
  cy.clearCookie("auth_token");
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
      loginViaUI(email?: string, password?: string): Chainable<void>;
      logout(): Chainable<void>;
    }
  }
}

export {};
