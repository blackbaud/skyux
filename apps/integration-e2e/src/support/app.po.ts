export const getGreeting = (): Cypress.Chainable<JQuery<HTMLElement>> =>
  cy.get('body > app-root > app-home > h2');
