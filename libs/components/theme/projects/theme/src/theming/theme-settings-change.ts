import { SkyThemeSettings } from './theme-settings';

/**
 * Describes a change to the current theme.
 */
export interface SkyThemeSettingsChange {
  /**
   * The theme settings being applied as a result of the change.
   */
  currentSettings: SkyThemeSettings;

  /**
   * The theme settings being replaced as a result of the change. This is undefined if the theme
   * settings are being set for the first time.
   */
  previousSettings: SkyThemeSettings;
}
