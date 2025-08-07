import { SkyTheme } from './theme';
import { SkyThemeBrand } from './theme-brand';
import { SkyThemeMode } from './theme-mode';
import { SkyThemeSettingsData } from './theme-serialization-types';
import { SkyThemeSpacing } from './theme-spacing';

/**
 * Specifies the theme and mode to be applied to a host element.
 */
export class SkyThemeSettings {
  /**
   * Creates a new SkyThemeSettings instance.
   * @param theme The theme configuration.
   * @param mode The theme mode.
   */
  constructor(
    public readonly theme: SkyTheme,
    public readonly mode: SkyThemeMode,
    public readonly spacing = SkyThemeSpacing.presets.standard,
    public readonly brand?: SkyThemeBrand,
  ) {}

  /**
   * Serializes the theme settings to a string.
   */
  public serialize(): string {
    const result: SkyThemeSettingsData = {
      theme: this.theme.serialize(),
      mode: this.mode.serialize(),
    };

    // Only include spacing if it's not the default
    if (this.spacing !== SkyThemeSpacing.presets.standard) {
      result.spacing = this.spacing.serialize();
    }

    // Only include brand if it exists
    if (this.brand) {
      result.brand = this.brand.serialize();
    }

    return JSON.stringify(result);
  }

  /**
   * Deserializes a string to a SkyThemeSettings instance.
   */
  public static deserialize(value: string): SkyThemeSettings {
    const settingsData = JSON.parse(value) as SkyThemeSettingsData;

    const theme = SkyTheme.deserialize(settingsData.theme);
    const mode = SkyThemeMode.deserialize(settingsData.mode);
    const spacing = settingsData.spacing
      ? SkyThemeSpacing.deserialize(settingsData.spacing)
      : SkyThemeSpacing.presets.standard;
    const brand = settingsData.brand
      ? SkyThemeBrand.deserialize(settingsData.brand)
      : undefined;

    return new SkyThemeSettings(theme, mode, spacing, brand);
  }
}
