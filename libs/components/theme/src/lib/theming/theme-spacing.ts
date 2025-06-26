import { SkyThemeSpacingData } from './theme-serialization-types';

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
    public readonly hostClass: string,
  ) {}

  /**
   * @internal
   * Serializes the theme spacing to a JSON-compatible object.
   */
  public serialize(): SkyThemeSpacingData {
    // Check if this instance is a preset
    const presetEntry = Object.entries(SkyThemeSpacing.presets).find(
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
   * Deserializes a JSON object to a SkyThemeSpacing instance.
   */
  public static deserialize(data: SkyThemeSpacingData): SkyThemeSpacing {
    if (data.isPreset) {
      const preset =
        SkyThemeSpacing.presets[
          data.name as keyof typeof SkyThemeSpacing.presets
        ];

      if (preset) {
        return preset;
      }

      throw new Error(`Unknown theme spacing preset: ${data.name}`);
    }

    if (!data.hostClass) {
      throw new Error('hostClass is required for non-preset theme spacing');
    }

    return new SkyThemeSpacing(data.name, data.hostClass);
  }
}
