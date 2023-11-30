/**
 * Defines properties of SKY UX theme spacing.
 */
export class SkyThemeSpacing {
  /**
   * The preset spacing available in SKY UX.
   */
  public static readonly presets = {
    standard: new SkyThemeSpacing('standard', 'sky-theme-spacing-standard'),
    compact: new SkyThemeSpacing('compact', 'sky-theme-spacing-compact'),
  };

  /**
   * Creates a new theme spacing.
   * @param name The name of the theme spacing.
   * @param hostClass The class on the host element which child components should reference when
   * adjusting for a specified theme spacing.
   */
  constructor(
    public readonly name: string,
    public readonly hostClass: string
  ) {}
}
