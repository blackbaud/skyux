// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Blur the active element to remove focus rings before taking a screenshot.
     */
    skyBlur(): Chainable<Subject>;
  }
}

/**
 * Blur the active element to remove focus rings before taking a screenshot.
 * This prevents focus rings from appearing in screenshots when components
 * auto-focus elements via setTimeout or similar async patterns.
 */
Cypress.Commands.add('skyBlur', { prevSubject: 'optional' }, (subject) => {
  cy.document({ log: false }).then({ timeout: 1000 }, (doc) => {
    (doc.activeElement as HTMLElement)?.blur();
  });

  if (subject) {
    return cy.wrap(subject, { log: false });
  }

  return;
});
