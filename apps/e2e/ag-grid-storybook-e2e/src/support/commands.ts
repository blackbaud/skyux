// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    waitForFonts(...fonts: string[]): Chainable<void>;

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

    percySnapshot(name: string, options?: any): void;

    /**
     * Capture a screenshot of the current page for visual regression testing.
     */
    skyVisualTest(
      name: string,
      options?: Record<string, unknown>
    ): Chainable<void>;
  }
}

Cypress.Commands.add('waitForFonts', (...fonts: string[]) => {
  return cy
    .document()
    .its('fonts.status', { timeout: 20000 })
    .should('equal', 'loaded')
    .end()
    .document()
    .then((doc) => {
      cy.wrap(doc.fonts).should('not.be.undefined');
      fonts.forEach((font) => {
        cy.wrap(doc.fonts).invoke('check', `16px "${font}"`).should('be.true');
      });
    })
    .end();
});

Cypress.Commands.add('waitForFontAwesome', () =>
  cy.waitForFonts('FontAwesome')
);
Cypress.Commands.add('waitForBlackbaudSans', () =>
  cy.waitForFonts('BLKB Sans')
);
Cypress.Commands.add('waitForFaAndBbFonts', () =>
  cy.waitForFonts('BLKB Sans', 'FontAwesome')
);

Cypress.Commands.add('percySnapshot', (name, options) => {
  // console.log('percySnapshot', name, options);
});

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
