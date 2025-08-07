import { SkyThemeModeData } from './theme-serialization-types';

/**
 * Defines properties of a SKY UX theme mode.
 */
export class SkyThemeMode {
  /**
   * The preset themes available in SKY UX.
   */
  public static readonly presets = {
    light: new SkyThemeMode('light', 'sky-theme-mode-light'),
    dark: new SkyThemeMode('dark', 'sky-theme-mode-dark'),
  };

  /**
   * Creates a new theme mode.
   * @param name The name of the theme mode.
   * @param hostClass The class on the host element which child components should reference when
   * adjusting for a specified theme mode.
   */
  constructor(
    public readonly name: string,
    public readonly hostClass: string,
  ) {}

  /**
   * @internal
   * Serializes the theme mode to a JSON-compatible object.
   */
  public serialize(): SkyThemeModeData {
    // Check if this instance is a preset
    const presetEntry = Object.entries(SkyThemeMode.presets).find(
      ([, preset]) => preset === this,
    );

    if (presetEntry) {
      return {
        name: this.name,
        isPreset: true,
      };
    }

    return {
      name: this.name,
      hostClass: this.hostClass,
    };
  }

  /**
   * @internal
   * Deserializes a JSON object to a SkyThemeMode instance.
   */
  public static deserialize(data: SkyThemeModeData): SkyThemeMode {
    if (data.isPreset) {
      const preset =
        SkyThemeMode.presets[data.name as keyof typeof SkyThemeMode.presets];

      if (preset) {
        return preset;
      }

      throw new Error(`Unknown theme mode preset: ${data.name}`);
    }

    if (!data.hostClass) {
      throw new Error('hostClass is required for non-preset theme modes');
    }

    return new SkyThemeMode(data.name, data.hostClass);
  }
}
