import { SkyThemeMode } from './theme-mode';

describe('SkyThemeMode', () => {
  it('should serialize preset mode correctly', () => {
    const mode = SkyThemeMode.presets.light;
    const serialized = mode.serialize();

    expect(serialized).toEqual({
      name: 'light',
      isPreset: true,
    });
  });

  it('should serialize custom mode correctly', () => {
    const mode = new SkyThemeMode('custom', 'sky-theme-mode-custom');
    const serialized = mode.serialize();

    expect(serialized).toEqual({
      name: 'custom',
      hostClass: 'sky-theme-mode-custom',
    });
  });

  it('should deserialize preset mode correctly', () => {
    const data = { name: 'light', isPreset: true };
    const mode = SkyThemeMode.deserialize(data);

    expect(mode).toBe(SkyThemeMode.presets.light);
  });

  it('should deserialize custom mode correctly', () => {
    const data = {
      name: 'custom',
      hostClass: 'sky-theme-mode-custom',
    };
    const mode = SkyThemeMode.deserialize(data);

    expect(mode.name).toBe('custom');
    expect(mode.hostClass).toBe('sky-theme-mode-custom');
  });

  it('should throw error for unknown preset', () => {
    const data = { name: 'unknown', isPreset: true };

    expect(() => SkyThemeMode.deserialize(data)).toThrowError(
      'Unknown theme mode preset: unknown',
    );
  });

  it('should throw error for missing hostClass in non-preset', () => {
    const data = { name: 'custom' };

    expect(() => SkyThemeMode.deserialize(data)).toThrowError(
      'hostClass is required for non-preset theme modes',
    );
  });
});
