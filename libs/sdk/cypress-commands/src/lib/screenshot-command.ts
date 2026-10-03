// `skyVisualTest` marks screenshots bound for Percy with a `url:` blackout entry,
// which is what `sendCypressScreenshotsToPercy` uploads.
function isSentToPercy(
  options: Partial<Cypress.ScreenshotOptions> | undefined,
): boolean {
  return !!options?.blackout?.some((item) => item.startsWith('url:'));
}

// Plain screenshots exist for local development. `skyE2ePreset` sets
// `skyLocalScreenshots` to false in CI, where only screenshots sent to Percy
// are needed.
Cypress.Commands.overwrite<'screenshot', 'optional'>(
  'screenshot',
  (originalFn, subject, name, options) => {
    if (
      Cypress.expose('skyLocalScreenshots') === false &&
      !isSentToPercy(options)
    ) {
      Cypress.log({
        name: 'screenshot',
        message: 'skipped outside local development',
      });
      return cy.wrap(subject, { log: false });
    }

    return originalFn(subject, name, options);
  },
);
