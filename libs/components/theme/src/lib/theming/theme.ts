import { SkyThemeMode } from './theme-mode';
import {
  SkyThemeData,
  SkyThemeModeData,
  SkyThemeSpacingData,
} from './theme-serialization-types';
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

  /**
   * @internal
   * Serializes the theme to a JSON-compatible object.
   */
  public serialize(): SkyThemeData {
    // Check if this instance is a preset
    const presetEntry = Object.entries(SkyTheme.presets).find(
      ([, preset]) => preset === this,
    );

    if (presetEntry) {
      return {
        name: this.name,
        supportedModes: this.supportedModes.map((mode) => mode.serialize()),
        isPreset: true,
      };
    }

    const result: SkyThemeData = {
      name: this.name,
      hostClass: this.hostClass,
      supportedModes: this.supportedModes.map((mode) => mode.serialize()),
    };

    // Only include supportedSpacing if it's not the default
    if (
      this.supportedSpacing.length !== 1 ||
      this.supportedSpacing[0] !== SkyThemeSpacing.presets.standard
    ) {
      result.supportedSpacing = this.supportedSpacing.map((spacing) =>
        spacing.serialize(),
      );
    }

    // Only include supportsBranding if it's true
    if (this.supportsBranding) {
      result.supportsBranding = this.supportsBranding;
    }

    return result;
  }

  /**
   * @internal
   * Deserializes a JSON object to a SkyTheme instance.
   */
  public static deserialize(data: SkyThemeData): SkyTheme {
    if (data.isPreset) {
      const preset =
        SkyTheme.presets[data.name as keyof typeof SkyTheme.presets];

      if (preset) {
        return preset;
      }

      throw new Error(`Unknown theme preset: ${data.name}`);
    }

    if (!data.hostClass) {
      throw new Error('hostClass is required for non-preset themes');
    }

    const supportedModes = data.supportedModes.map((modeData) =>
      SkyThemeMode.deserialize(modeData),
    );

    const supportedSpacing = data.supportedSpacing
      ? data.supportedSpacing.map((spacingData) =>
          SkyThemeSpacing.deserialize(spacingData),
        )
      : [SkyThemeSpacing.presets.standard];

    return new SkyTheme(
      data.name,
      data.hostClass,
      supportedModes,
      supportedSpacing,
      data.supportsBranding ?? false,
    );
  }
}
