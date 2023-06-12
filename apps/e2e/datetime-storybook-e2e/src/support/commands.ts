// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    /**
     * Capture a screenshot of the current page for visual regression testing.
     */
    skyVisualTest(
      name: string,
      options?: Record<string, unknown>
    ): Chainable<void>;
  }
}

/**
 * Capture a screenshot of the current page for visual regression testing. Include the URL in `blackout` because that is
 * the only arbitrary value field that becomes available in the after-screenshot hook, and it is required by Percy.
 */
Cypress.Commands.add(
  'skyVisualTest',
  {
    prevSubject: ['optional', 'element', 'window'],
  },
  (
    prevSubject: void | Window | Cypress.JQueryWithSelector<HTMLElement>,
    name: string,
    options?: Record<string, unknown>
  ): void => {
    cy.url().then((url) => {
      if (prevSubject) {
        cy.wrap(prevSubject)
          .should('exist')
          .should('be.visible')
          .screenshot(name, {
            ...options,
            blackout: [`url:${url}`],
          });
      } else {
        cy.screenshot(name, {
          ...options,
          blackout: [`url:${url}`],
        });
      }
    });
  }
);
