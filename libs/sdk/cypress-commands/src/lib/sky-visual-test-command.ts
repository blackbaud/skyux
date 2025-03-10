// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    /**
     * Capture a screenshot of the current page for visual regression testing.
     */
    skyVisualTest(
      name: string,
      options?: Record<string, unknown>,
    ): Chainable<void>;
  }
}

/**
 * Capture a screenshot of the current page for visual regression testing. Include the URL in `blackout` because that is
 * the only arbitrary value field that becomes available in the after-screenshot hook, and it is required by Percy.
 */
Cypress.Commands.add(
  'skyVisualTest',
  (name: string, options?: Record<string, unknown>) => {
    cy.url().then((url) => {
      cy.screenshot(name, {
        ...options,
        blackout: [`url:${url}`],
      });
    });
  },
);
