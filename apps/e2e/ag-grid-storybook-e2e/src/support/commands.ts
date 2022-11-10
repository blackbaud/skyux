// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    waitForFonts(weights: string[], ...fonts: string[]): Chainable<void>;

    /**
     * Wait for Font Awesome to be loaded.
     */
    waitForFontAwesome(): Chainable<void>;

    /**
     * Wait for BLKB Sans to be loaded.
     */
    waitForBlackbaudSans(): Chainable<void>;

    /**
     * Wait for Font Awesome and BLKB Sans to be loaded.
     */
    waitForFaAndBbFonts(): Chainable<void>;

    /**
     * Capture a screenshot of the current page for visual regression testing.
     */
    skyVisualTest(
      name: string,
      options?: Record<string, unknown>
    ): Chainable<void>;
  }
}

Cypress.Commands.add(
  'waitForFonts',
  (weights: string[], ...fonts: string[]) => {
    return cy
      .document()
      .its('fonts.status', { timeout: 20000 })
      .should('equal', 'loaded', { timeout: 20000 })
      .end()
      .document()
      .then((doc) => {
        cy.wrap(doc.fonts).should('not.be.undefined');
        fonts.forEach((font) => {
          cy.wrap(doc.fonts)
            .invoke('check', `16px "${font}"`)
            .should('be.true', undefined, { timeout: 20000 });
        });
      })
      .end();
  }
);

Cypress.Commands.add('waitForFaAndBbFonts', () =>
  cy
    .waitForFonts(['normal'], 'BLKB Sans', 'BLKB Sans Condensed', 'FontAwesome')
    .waitForFonts(['300', '600'], 'BLKB Sans', 'BLKB Sans Condensed')
);

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
  }
);
