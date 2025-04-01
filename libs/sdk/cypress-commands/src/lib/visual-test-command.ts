// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Capture a screenshot of the current page for visual regression testing.
     */
    skyVisualTest(
      name: string,
      options?: Record<string, unknown>,
      selector?: string,
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
    options?: Record<string, unknown>,
    selector?: string,
  ): void => {
    cy.url().then((url) => {
      const cyPrefix = selector ? cy.get(selector) : cy;

      if (
        prevSubject &&
        !Object.prototype.hasOwnProperty.call(prevSubject, 'window')
      ) {
        cyPrefix
          .wrap(prevSubject)
          .should('exist')
          .should('be.visible')
          .screenshot(name, {
            ...options,
            blackout: [`url:${url}`],
          });
      } else {
        cyPrefix.screenshot(name, {
          ...options,
          blackout: [`url:${url}`],
        });
      }
    });
  },
);
