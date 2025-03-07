// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    ready(
      appName?: string,
      additionalExistingEls?: string[],
      additionalVisibleEls?: string[],
    ): Chainable<Subject>;
  }
}

Cypress.Commands.add(
  'ready',
  (
    appName?: string,
    additionalExistingEls?: string[],
    additionalVisibleEls?: string[],
  ) => {
    additionalExistingEls?.forEach((el) => {
      cy.get(el).should('exist');
    });

    additionalVisibleEls?.forEach((el) => {
      cy.get(el).should('exist').should('be.visible');
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
