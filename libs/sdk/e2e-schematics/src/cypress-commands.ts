// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    ready(
      appName?: string,
      additionalRequiredEls?: string[],
      timeout?: number,
    ): Chainable<Subject>;
  }
}

Cypress.Commands.add(
  'ready',
  (appName?: string, additionalRequiredEls?: string[], timeout?: number) => {
    additionalRequiredEls?.forEach((el) => {
      cy.get(el, { timeout }).should('exist');
    });

    if (appName) {
      return cy
        .get('#assetsLoaded', { timeout })
        .should('exist')
        .get(appName, { timeout })
        .should('exist')
        .should('be.visible');
    } else {
      return cy.get('#assetsLoaded', { timeout }).should('exist');
    }
  },
);
