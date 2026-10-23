// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
// Import commands.js using ES2015 syntax:
import '@skyux-sdk/cypress-commands';

import './commands';

// Resizing a grid (for example, switching themes in place) makes the browser report a benign
// ResizeObserver loop error, which Cypress treats as a test failure.
// See https://github.com/cypress-io/cypress/issues/20341.
Cypress.on(
  'uncaught:exception',
  (err) =>
    !err.message.includes(
      'ResizeObserver loop completed with undelivered notifications.',
    ),
);
