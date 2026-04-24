/**
 * Blur the active element before every screenshot capture. This prevents
 * focus rings from appearing in screenshots when components auto-focus
 * elements via setTimeout or similar async patterns.
 */
Cypress.Commands.overwrite(
  'screenshot',
  function (originalFn, subject, ...args) {
    // Blur the active element and wait a tick for the browser to repaint
    // before taking the screenshot.
    cy.document({ log: false })
      .then({ timeout: 1000 }, (doc) => {
        (doc.activeElement as HTMLElement)?.blur();
      })
      .wait(0, { log: false });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const callOriginal = (): any => originalFn(subject, ...args);

    if (subject) {
      return cy.wrap(subject, { log: false }).then(() => {
        return callOriginal();
      });
    }

    return callOriginal();
  },
);
