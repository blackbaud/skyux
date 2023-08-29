let consoleErrorSpy: Cypress.Agent<sinon.SinonSpy> | undefined;
Cypress.addListener('before:window:load', (win) => {
  consoleErrorSpy = cy.spy(win.console, 'error');
});

// This is to mitigate a Cypress issue (https://github.com/cypress-io/cypress/issues/20341) where a ResizeObserver exception is thrown.
Cypress.on(
  'uncaught:exception',
  (err) => !err.message.includes('ResizeObserver loop limit exceeded')
);

describe('code-example', () => {
  it('should load the example without errors', () => {
    cy.visit('/')
      .get('app-root')
      .should('exist')
      .should('be.visible')
      .then(() => {
        if (consoleErrorSpy) {
          expect(consoleErrorSpy).not.to.be.called;
        }
      });
  });
});
