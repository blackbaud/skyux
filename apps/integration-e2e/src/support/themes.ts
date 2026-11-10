import { E2EVariationName, E2eVariations } from '@skyux-sdk/e2e-schematics';

export const JG_THEME = 'modern-v2-light-jg';

export function forEachThemeAndBrand(
  callback: (theme: E2EVariationName | typeof JG_THEME) => void,
): void {
  E2eVariations.forEachTheme(callback);
  callback(JG_THEME);
}
