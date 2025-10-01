// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    /**
     * Capture icon names that appear on the screen.
     */
    skyCaptureIconNames(): Chainable<void>;
  }
}

/**
 * Choose theme for visual regression testing.
 */
Cypress.Commands.add('skyCaptureIconNames', () => {
  const iconNames = Cypress.$('sky-icon-svg')
    .map((_idx, el) => el.getAttribute('data-sky-icon'))
    .get()
    .filter(Boolean) as string[];
  cy.task('skyCaptureIconNamesToFile', {
    test: Cypress.currentTest.title,
    file: Cypress.spec.name,
    iconNames,
  });
});
