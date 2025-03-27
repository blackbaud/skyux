import { SkyThemeMode } from './theme-mode';
import { SkyThemeSpacing } from './theme-spacing';

/**
 * Defines properties of a SKY UX theme.
 */
export class SkyTheme {
  /**
   * The preset themes available in SKY UX.
   */
  public static readonly presets = {
    default: new SkyTheme(
      'default',
      'sky-theme-default',
      [SkyThemeMode.presets.light],
      [SkyThemeSpacing.presets.standard],
    ),
    modern: new SkyTheme(
      'modern',
      'sky-theme-modern',
      [SkyThemeMode.presets.light, SkyThemeMode.presets.dark],
      [SkyThemeSpacing.presets.standard, SkyThemeSpacing.presets.compact],
      true,
    ),
  };

  /**
   * Creates a new theme.
   * @param name The name of the theme.
   * @param hostClass The class on the host element which child components should reference when
   * adjusting for a specified theme.
   * @param supportedModes An array of modes supported by the theme.
   * @param supportedSpacing An array of spacing modes supported by the theme.
   */
  constructor(
    public readonly name: string,
    public readonly hostClass: string,
    public readonly supportedModes: SkyThemeMode[],
    public readonly supportedSpacing = [SkyThemeSpacing.presets.standard],
    public readonly supportsBranding = false,
  ) {}
}
