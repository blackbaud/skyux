// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable<Subject> {
    skyReady(
      appName?: string,
      additionalExistingEls?: string[],
      additionalVisibleEls?: string[],
    ): Chainable<Subject>;
  }
}

Cypress.Commands.add(
  'skyReady',
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
