export type E2EVariationName =
  | 'default'
  | 'modern-light'
  | 'modern-dark'
  | 'modern-v2-light'
  | 'modern-v2-dark';

export const E2eVariations = {
  DISPLAY_WIDTHS: [1280],
  RESPONSIVE_WIDTHS: [375, 800, 1000, 1280],
  MOBILE_WIDTHS: [375],

  forEachTheme: (
    callback: (theme: E2EVariationName) => void,
    includeModernV2 = true,
  ): void => {
    callback('default');

    if (includeModernV2) {
      callback('modern-v2-light');
      callback('modern-v2-dark');
    }
  },
};
