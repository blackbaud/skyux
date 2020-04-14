import {
  SkyThemeMode
} from './theme-mode';

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
      [
        SkyThemeMode.presets.light
      ]
    ),
    modern: new SkyTheme(
      'modern',
      'sky-theme-modern',
      [
        SkyThemeMode.presets.light,
        SkyThemeMode.presets.dark
      ]
    )
  };

  /**
   * Creates a new theme.
   * @param name The name of the theme.
   * @param hostClass The class on the host element which child components should reference when
   * adusting for a specified theme.
   * @param supportsDarkMode A flag indicating whether the theme supports dark mode.
   */
  constructor(
    public readonly name: string,
    public readonly hostClass: string,
    public readonly supportedModes: SkyThemeMode[]
  ) { }

}
