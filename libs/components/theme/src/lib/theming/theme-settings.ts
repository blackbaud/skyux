import { SkyThemeMode } from './theme-mode';

import { SkyTheme } from './theme';

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
    public readonly mode: SkyThemeMode
  ) {}
}
