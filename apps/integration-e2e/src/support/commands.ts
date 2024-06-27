// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    /**
     * Capture a screenshot of the current page for visual regression testing.
     */
    skyVisualTest(
      name: string,
      options?: Record<string, unknown>,
    ): Chainable<void>;

    /**
     * Choose theme for visual regression testing.
     */
    skyChooseTheme(theme: string): Chainable<void>;
  }
}

/**
 * Capture a screenshot of the current page for visual regression testing. Include the URL in `blackout` because that is
 * the only arbitrary value field that becomes available in the after-screenshot hook, and it is required by Percy.
 */
Cypress.Commands.add(
  'skyVisualTest',
  (name: string, options?: Record<string, unknown>) => {
    cy.url().then((url) => {
      cy.screenshot(name, {
        ...options,
        blackout: [`url:${url}`],
      });
    });
  },
);

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
