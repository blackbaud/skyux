// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    /**
     * Choose theme for visual regression testing.
     */
    skyChooseTheme(theme: string): Chainable<void>;
  }
}

/**
 * Choose theme for visual regression testing.
 */
Cypress.Commands.add('skyChooseTheme', (theme: string) => {
  cy.get('select.sky-theme-selector')
    .first()
    .should('be.visible')
    .select(theme);
  const [themeName, themeMode] = theme.split('-');
  cy.get('body').should('have.class', `sky-theme-${themeName}`);
  cy.get('body').should('have.class', `sky-theme-mode-${themeMode || 'light'}`);
});
