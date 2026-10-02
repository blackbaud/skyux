export type E2EVariationName = 'default' | 'modern-v2-dark' | 'modern-v2-light';

export const E2eVariations = {
  DISPLAY_WIDTHS: [1280],
  RESPONSIVE_WIDTHS: [375, 800, 1000, 1280],
  MOBILE_WIDTHS: [375],

  forEachTheme: (callback: (theme: E2EVariationName) => void): void => {
    callback('default');
    callback('modern-v2-light');
    callback('modern-v2-dark');
  },
};

/**
 * Captures every `screenshot` and `percySnapshot` in the enclosing suite once per
 * theme, switching themes in place instead of reloading the page. Call it at the
 * top of a spec file or inside a `describe`; the innermost call wins.
 * @param themes The themes to capture. Defaults to every theme.
 */
export function skyThemes(themes?: E2EVariationName[]): void {
  const activeThemes: E2EVariationName[] = themes ?? [];
  if (!themes) {
    E2eVariations.forEachTheme((theme) => activeThemes.push(theme));
  }

  beforeEach(() => {
    themeState().skyActiveThemes = activeThemes;
  });

  afterEach(() => {
    delete themeState().skyActiveThemes;
  });
}

// Stored on the `Cypress` global rather than in this module because Cypress
// bundles the spec and the support file separately, and each bundle gets its own
// copy of this module. `@skyux-sdk/cypress-commands` reads it.
function themeState(): { skyActiveThemes?: E2EVariationName[] } {
  return (
    globalThis as unknown as {
      Cypress: { skyActiveThemes?: E2EVariationName[] };
    }
  ).Cypress;
}
