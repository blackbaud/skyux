// Import Percy's command before overriding it: overriding a command that isn't
// registered throws, and not every project's support file imports Percy.
import '@percy/cypress';

import type { E2EVariationName } from '@skyux-sdk/e2e-schematics';

const THEME_BODY_CLASSES: Record<E2EVariationName, [string, string]> = {
  default: ['sky-theme-default', 'sky-theme-mode-light'],
  'modern-v2-light': ['sky-theme-modern', 'sky-theme-mode-light'],
  'modern-v2-dark': ['sky-theme-modern', 'sky-theme-mode-dark'],
};

function getActiveThemes(): E2EVariationName[] | undefined {
  // Set by `skyThemes()` in `@skyux-sdk/e2e-schematics`. It lives on the
  // `Cypress` global because the spec and support bundles don't share modules.
  return (Cypress as unknown as { skyActiveThemes?: E2EVariationName[] })
    .skyActiveThemes;
}

function nameForTheme(name: string, theme: E2EVariationName): string {
  return name.includes('{theme}')
    ? name.replace('{theme}', theme)
    : `${name}-${theme}`;
}

function requireName(name: unknown, command: string): string {
  if (typeof name !== 'string' || name === '') {
    throw new Error(
      `\`${command}\` needs a name when \`skyThemes\` is active.`,
    );
  }

  return name;
}

function switchTheme(theme: E2EVariationName): void {
  const [themeClass, modeClass] = THEME_BODY_CLASSES[theme];

  cy.get('body', { log: false }).then(($body) => {
    if ($body.hasClass(themeClass) && $body.hasClass(modeClass)) {
      return;
    }

    cy.window({ log: false }).then((win) => {
      const channel = (
        win as unknown as {
          __STORYBOOK_ADDONS_CHANNEL__?: {
            emit(event: string, data: unknown): void;
          };
        }
      ).__STORYBOOK_ADDONS_CHANNEL__;

      if (!channel) {
        throw new Error(
          `\`skyThemes\` needs a Storybook preview page, but ${win.location.href} has no Storybook channel.`,
        );
      }

      channel.emit('updateGlobals', { globals: { theme } });
    });

    // A short timeout so a theme that never applies fails fast instead of
    // waiting out the 60s default command timeout on every retry.
    cy.get('body', { log: false, timeout: 10000 }).should(($body) => {
      if (!$body.hasClass(themeClass) || !$body.hasClass(modeClass)) {
        throw new Error(
          `\`skyThemes\` switched to "${theme}", but <body> never got the ${themeClass} and ${modeClass} classes.`,
        );
      }
    });

    // Give change detection and layout from the theme change two frames to
    // settle before capturing.
    cy.window({ log: false }).then(
      (win) =>
        new Cypress.Promise<void>((resolve) => {
          win.requestAnimationFrame(() =>
            win.requestAnimationFrame(() => resolve()),
          );
        }),
    );
  });
}

// `skyVisualTest` marks screenshots bound for Percy with a `url:` blackout entry,
// which is what `sendCypressScreenshotsToPercy` uploads.
function isSentToPercy(
  options: Partial<Cypress.ScreenshotOptions> | undefined,
): boolean {
  return !!options?.blackout?.some((item) => item.startsWith('url:'));
}

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

    const themes = getActiveThemes();
    if (!themes) {
      return originalFn(subject, name, options);
    }

    const baseName = requireName(name, 'screenshot');
    for (const theme of themes) {
      switchTheme(theme);
      cy.then(() =>
        originalFn(subject, nameForTheme(baseName, theme), options),
      );
    }

    return cy.wrap(subject, { log: false });
  },
);

Cypress.Commands.overwrite('percySnapshot', (originalFn, name, options) => {
  const themes = getActiveThemes();
  if (!themes) {
    originalFn(name, options);
    return;
  }

  const baseName = requireName(name, 'percySnapshot');
  for (const theme of themes) {
    switchTheme(theme);
    cy.then(() => {
      originalFn(nameForTheme(baseName, theme), options);
    });
  }
});
