// ***********************************************************
// This file is processed and loaded automatically before
// your test files.
// ***********************************************************

import "./commands";

// Suppress React hydration mismatch errors.
// Next.js with client-side theme/language state causes expected
// SSR/CSR mismatches (e.g. theme script in <head>).
// These are NOT real application bugs — just SSR rehydration noise.
Cypress.on("uncaught:exception", (err) => {
  if (
    err.message.includes("Hydration") ||
    err.message.includes("hydration") ||
    err.message.includes("Minified React error") ||
    err.message.includes("Text content does not match") ||
    err.message.includes("did not match")
  ) {
    return false; // prevent Cypress from failing the test
  }
  // Let other errors fail the test
});
