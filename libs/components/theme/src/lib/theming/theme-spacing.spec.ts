import { SkyThemeSpacing } from './theme-spacing';

describe('SkyThemeSpacing', () => {
  it('should serialize preset spacing correctly', () => {
    const serialized = SkyThemeSpacing.presets.compact.serialize();

    expect(serialized).toEqual({
      name: 'compact',
      isPreset: true,
    });
  });

  it('should serialize custom spacing correctly', () => {
    const spacing = new SkyThemeSpacing('custom', 'sky-theme-spacing-custom');
    const serialized = spacing.serialize();

    expect(serialized).toEqual({
      name: 'custom',
      hostClass: 'sky-theme-spacing-custom',
    });
  });

  it('should deserialize preset spacing correctly', () => {
    const spacing = SkyThemeSpacing.deserialize({
      name: 'standard',
      isPreset: true,
    });

    expect(spacing).toBe(SkyThemeSpacing.presets.standard);
  });

  it('should deserialize custom spacing correctly', () => {
    const spacing = SkyThemeSpacing.deserialize({
      name: 'custom',
      hostClass: 'sky-theme-spacing-custom',
    });

    expect(spacing.name).toBe('custom');
    expect(spacing.hostClass).toBe('sky-theme-spacing-custom');
  });

  it('should throw error for unknown preset', () => {
    expect(() =>
      SkyThemeSpacing.deserialize({ name: 'unknown', isPreset: true }),
    ).toThrowError('Unknown theme spacing preset: unknown');
  });

  it('should throw error for missing hostClass in non-preset', () => {
    expect(() => SkyThemeSpacing.deserialize({ name: 'custom' })).toThrowError(
      'hostClass is required for non-preset theme spacing',
    );
  });
});
