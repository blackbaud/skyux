export type E2EVariationName = 'default' | 'modern-light' | 'modern-dark';

export class E2eVariations {
  public static readonly DISPLAY_WIDTHS = [1280];
  public static readonly RESPONSIVE_WIDTHS = [375, 1280];

  public static forEachTheme(
    callback: (theme: E2EVariationName) => void
  ): void {
    callback('default');
    callback('modern-light');
  }
}
