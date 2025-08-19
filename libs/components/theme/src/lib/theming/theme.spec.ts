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

  describe('serialization', () => {
    it('should serialize preset theme correctly', () => {
      const serialized = SkyTheme.presets.modern.serialize();

      expect(serialized.name).toBe('modern');
      expect(serialized.isPreset).toBe(true);
      expect(serialized.supportedModes).toEqual([
        { name: 'light', isPreset: true },
        { name: 'dark', isPreset: true },
      ]);
    });

    it('should serialize custom theme correctly', () => {
      const theme = new SkyTheme(
        'custom',
        'sky-theme-custom',
        [SkyThemeMode.presets.light],
        [SkyThemeSpacing.presets.compact],
        true,
      );

      const serialized = theme.serialize();

      expect(serialized).toEqual({
        name: 'custom',
        hostClass: 'sky-theme-custom',
        supportedModes: [{ name: 'light', isPreset: true }],
        supportedSpacing: [{ name: 'compact', isPreset: true }],
        supportsBranding: true,
      });
    });

    it('should serialize theme with default values omitted', () => {
      const theme = new SkyTheme('simple', 'sky-theme-simple', [
        SkyThemeMode.presets.light,
      ]);

      const serialized = theme.serialize();

      expect(serialized).toEqual({
        name: 'simple',
        hostClass: 'sky-theme-simple',
        supportedModes: [{ name: 'light', isPreset: true }],
      });
      expect(serialized.supportedSpacing).toBeUndefined();
      expect(serialized.supportsBranding).toBeUndefined();
    });

    it('should deserialize preset theme correctly', () => {
      const theme = SkyTheme.deserialize({
        name: 'default',
        isPreset: true,
        supportedModes: [{ name: 'light', isPreset: true }],
      });

      expect(theme).toBe(SkyTheme.presets.default);
    });

    it('should deserialize custom theme correctly', () => {
      const theme = SkyTheme.deserialize({
        name: 'custom',
        hostClass: 'sky-theme-custom',
        supportedModes: [{ name: 'light', isPreset: true }],
        supportedSpacing: [{ name: 'compact', isPreset: true }],
        supportsBranding: true,
      });

      expect(theme.name).toBe('custom');
      expect(theme.hostClass).toBe('sky-theme-custom');
      expect(theme.supportedModes).toEqual([SkyThemeMode.presets.light]);
      expect(theme.supportedSpacing).toEqual([SkyThemeSpacing.presets.compact]);
      expect(theme.supportsBranding).toBe(true);
    });

    it('should throw error for unknown preset', () => {
      expect(() =>
        SkyTheme.deserialize({
          name: 'unknown',
          isPreset: true,
          supportedModes: [{ name: 'light', isPreset: true }],
        }),
      ).toThrowError('Unknown theme preset: unknown');
    });

    it('should throw error for missing hostClass in non-preset', () => {
      expect(() =>
        SkyTheme.deserialize({
          name: 'custom',
          supportedModes: [{ name: 'light', isPreset: true }],
        }),
      ).toThrowError('hostClass is required for non-preset themes');
    });

    it('should default to standard spacing when supportedSpacing is not provided', () => {
      const theme = SkyTheme.deserialize({
        name: 'custom',
        hostClass: 'sky-theme-custom',
        supportedModes: [{ name: 'light', isPreset: true }],
        // supportedSpacing is intentionally omitted
      });

      expect(theme.supportedSpacing).toEqual([
        SkyThemeSpacing.presets.standard,
      ]);
    });

    it('should default to false when supportsBranding is not provided', () => {
      const theme = SkyTheme.deserialize({
        name: 'custom',
        hostClass: 'sky-theme-custom',
        supportedModes: [{ name: 'light', isPreset: true }],
        // supportsBranding is intentionally omitted
      });

      expect(theme.supportsBranding).toBe(false);
    });
  });
});
