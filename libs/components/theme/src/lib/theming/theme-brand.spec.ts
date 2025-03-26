import { SkyThemeBrand } from './theme-brand';

describe('Theme brand', () => {
  it('should set the name correctly', () => {
    const brand = new SkyThemeBrand('custom-brand', '1.0.0');
    expect(brand.name).toBe('custom-brand');
  });

  it('should have the correct host class', () => {
    const brand = new SkyThemeBrand('custom-brand', '1.0.0');

    expect(brand.hostClass).toBe('sky-theme-brand-custom-brand');
  });

  it('should have the correct host class when a manual host class is given', () => {
    const brand = new SkyThemeBrand(
      'custom-brand',
      '1.0.0',
      'custom-host-class',
    );

    expect(brand.hostClass).toBe('custom-host-class');
  });

  it('should have the correct version', () => {
    const brand = new SkyThemeBrand('custom-brand', '1.0.0');

    expect(brand.version).toBe('1.0.0');
  });

  it('should set the version correctly when a version with an appropriate suffix is given', () => {
    const suffixes = ['alpha.1', 'beta.1', 'rc.1'];
    suffixes.forEach((suffix) => {
      const version = `1.0.0-${suffix}`;
      const brand = new SkyThemeBrand('custom-brand', version);
      expect(brand.version).toBe(version);
    });
  });

  it('should throw an error for an invalid version', () => {
    expect(() => {
      new SkyThemeBrand('custom-brand', '1-x-foo');
    }).toThrowError(
      'Invalid version format "1-x-foo" for theme brand "custom-brand".',
    );
  });

  it('should throw an error for a version with only a major version', () => {
    expect(() => {
      new SkyThemeBrand('custom-brand', '1');
    }).toThrowError(
      'Invalid version format "1" for theme brand "custom-brand".',
    );
  });

  it('should throw an error for a version with only a major and minor version', () => {
    expect(() => {
      new SkyThemeBrand('custom-brand', '1.0');
    }).toThrowError(
      'Invalid version format "1.0" for theme brand "custom-brand".',
    );
  });

  it('should throw an error for a version with an invalid suffix', () => {
    expect(() => {
      new SkyThemeBrand('custom-brand', '1.0.0-invalid.0');
    }).toThrowError(
      'Invalid version format "1.0.0-invalid.0" for theme brand "custom-brand".',
    );
  });
});
