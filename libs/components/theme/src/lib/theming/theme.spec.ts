import { SkyTheme } from './theme';
import { SkyThemeMode } from './theme-mode';
import { SkyThemeSpacing } from './theme-spacing';

describe('SkyTheme', () => {
  it('should default supportedSpacing to standard when not specified', () => {
    const theme = new SkyTheme('foo', 'sky-theme-foo', [
      SkyThemeMode.presets.light,
    ]);

    expect(theme.supportedSpacing).toEqual([SkyThemeSpacing.presets.standard]);
  });
});
