import { SkyTheme } from './theme';
import { SkyThemeBrand } from './theme-brand';
import { SkyThemeMode } from './theme-mode';
import { SkyThemeSettings } from './theme-settings';
import { SkyThemeSpacing } from './theme-spacing';

describe('SkyThemeSettings', () => {
  it('should serialize settings while omitting default values', () => {
    const settings = new SkyThemeSettings(
      SkyTheme.presets.default,
      SkyThemeMode.presets.light,
    );

    const settingsData = JSON.parse(settings.serialize());

    expect(settingsData).toEqual({
      theme: {
        name: 'default',
        isPreset: true,
        supportedModes: [{ name: 'light', isPreset: true }],
      },
      mode: { name: 'light', isPreset: true },
    });
    expect(settingsData.spacing).toBeUndefined();
    expect(settingsData.brand).toBeUndefined();
  });

  it('should serialize complete settings correctly', () => {
    const settings = new SkyThemeSettings(
      SkyTheme.presets.modern,
      SkyThemeMode.presets.dark,
      SkyThemeSpacing.presets.compact,
      new SkyThemeBrand('rainbow', '1.0.0'),
    );

    const settingsData = JSON.parse(settings.serialize());

    expect(settingsData.theme.name).toBe('modern');
    expect(settingsData.mode.name).toBe('dark');
    expect(settingsData.spacing).toEqual({ name: 'compact', isPreset: true });
    expect(settingsData.brand).toEqual({ name: 'rainbow', version: '1.0.0' });
  });

  it('should deserialize settings correctly', () => {
    const serialized = JSON.stringify({
      theme: {
        name: 'modern',
        isPreset: true,
        supportedModes: [
          { name: 'light', isPreset: true },
          { name: 'dark', isPreset: true },
        ],
      },
      mode: { name: 'dark', isPreset: true },
      spacing: { name: 'compact', isPreset: true },
      brand: { name: 'rainbow', version: '1.0.0' },
    });

    const settings = SkyThemeSettings.deserialize(serialized);

    expect(settings.theme).toBe(SkyTheme.presets.modern);
    expect(settings.mode).toBe(SkyThemeMode.presets.dark);
    expect(settings.spacing).toBe(SkyThemeSpacing.presets.compact);
    expect(settings.brand?.name).toBe('rainbow');
    expect(settings.brand?.version).toBe('1.0.0');
  });

  it('should round-trip serialize/deserialize correctly', () => {
    const originalSettings = new SkyThemeSettings(
      SkyTheme.presets.modern,
      SkyThemeMode.presets.dark,
      SkyThemeSpacing.presets.compact,
      new SkyThemeBrand('custom', '2.1.0', 'custom-brand-class'),
    );

    const serialized = originalSettings.serialize();
    const deserialized = SkyThemeSettings.deserialize(serialized);

    expect(deserialized.theme).toBe(originalSettings.theme);
    expect(deserialized.mode).toBe(originalSettings.mode);
    expect(deserialized.spacing).toBe(originalSettings.spacing);
    expect(deserialized.brand?.name).toBe(originalSettings.brand?.name);
    expect(deserialized.brand?.version).toBe(originalSettings.brand?.version);
    expect(deserialized.brand?.hostClass).toBe(
      originalSettings.brand?.hostClass,
    );
  });

  describe('Error handling', () => {
    it('should throw error for invalid JSON', () => {
      expect(() => SkyThemeSettings.deserialize('invalid json')).toThrow();
    });

    it('should throw error for malformed data structure', () => {
      expect(() => SkyThemeSettings.deserialize('{}')).toThrow();
    });

    it('should propagate errors from nested deserialize calls', () => {
      // Test error from SkyTheme.deserialize
      const invalidThemeData = JSON.stringify({
        theme: { name: 'unknown', isPreset: true, supportedModes: [] },
        mode: { name: 'light', isPreset: true },
      });

      expect(() => SkyThemeSettings.deserialize(invalidThemeData)).toThrowError(
        'Unknown theme preset: unknown',
      );

      // Test error from SkyThemeMode.deserialize
      const invalidModeData = JSON.stringify({
        theme: { name: 'default', isPreset: true, supportedModes: [] },
        mode: { name: 'unknown', isPreset: true },
      });

      expect(() => SkyThemeSettings.deserialize(invalidModeData)).toThrowError(
        'Unknown theme mode preset: unknown',
      );
    });

    it('should default to standard spacing when spacing is not provided', () => {
      const data = JSON.stringify({
        theme: { name: 'default', isPreset: true, supportedModes: [] },
        mode: { name: 'light', isPreset: true },
        // spacing is intentionally omitted
      });

      const settings = SkyThemeSettings.deserialize(data);

      expect(settings.spacing).toBe(SkyThemeSpacing.presets.standard);
    });

    it('should default to undefined when brand is not provided', () => {
      const data = JSON.stringify({
        theme: { name: 'default', isPreset: true, supportedModes: [] },
        mode: { name: 'light', isPreset: true },
        // brand is intentionally omitted
      });

      const settings = SkyThemeSettings.deserialize(data);

      expect(settings.brand).toBeUndefined();
    });
  });
});
