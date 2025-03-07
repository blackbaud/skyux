// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    ready(
      appName?: string,
      additionalRequiredEls?: string[],
    ): Chainable<Subject>;
  }
}

Cypress.Commands.add(
  'ready',
  (appName?: string, additionalRequiredEls?: string[]) => {
    additionalRequiredEls?.forEach((el) => {
      cy.get(el).should('exist');
    });

    if (appName) {
      return cy
        .get('#assetsLoaded')
        .should('exist')
        .get(appName)
        .should('exist')
        .should('be.visible');
    } else {
      return cy.get('#assetsLoaded').should('exist');
    }
  },
);
