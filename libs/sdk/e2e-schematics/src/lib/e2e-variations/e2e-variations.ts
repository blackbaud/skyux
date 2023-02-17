export type E2EVariationName = 'default' | 'modern-light' | 'modern-dark';

export const E2eVariations = {
  DISPLAY_WIDTHS: [1280],
  RESPONSIVE_WIDTHS: [375, 1280],
  MOBILE_WIDTHS: [375],

  forEachTheme: (callback: (theme: E2EVariationName) => void) => {
    callback('default');
    callback('modern-light');
  },
};
