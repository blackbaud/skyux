import { SkyTheme } from './theme';
import { SkyThemeBrand } from './theme-brand';
import { SkyThemeMode } from './theme-mode';
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
}
