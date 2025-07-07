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

  it('should set styleUrl correctly when provided', () => {
    const styleUrl = 'https://example.com/styles.css';
    const brand = new SkyThemeBrand('custom-brand', '1.0.0', undefined, styleUrl);

    expect(brand.styleUrl).toBe(styleUrl);
  });

  it('should set sriHash correctly when provided', () => {
    const sriHash = 'sha384-abc123def456';
    const brand = new SkyThemeBrand('custom-brand', '1.0.0', undefined, undefined, sriHash);

    expect(brand.sriHash).toBe(sriHash);
  });

  it('should set both styleUrl and sriHash when provided', () => {
    const styleUrl = 'https://example.com/styles.css';
    const sriHash = 'sha384-abc123def456';
    const brand = new SkyThemeBrand('custom-brand', '1.0.0', undefined, styleUrl, sriHash);

    expect(brand.styleUrl).toBe(styleUrl);
    expect(brand.sriHash).toBe(sriHash);
  });

  it('should set all parameters correctly when provided', () => {
    const styleUrl = 'https://example.com/styles.css';
    const sriHash = 'sha384-abc123def456';
    const hostClass = 'custom-host-class';
    const brand = new SkyThemeBrand('custom-brand', '1.0.0', hostClass, styleUrl, sriHash);

    expect(brand.name).toBe('custom-brand');
    expect(brand.version).toBe('1.0.0');
    expect(brand.hostClass).toBe(hostClass);
    expect(brand.styleUrl).toBe(styleUrl);
    expect(brand.sriHash).toBe(sriHash);
  });

  it('should set the version correctly when a version with an appropriate suffix is given', () => {
    const suffixes = ['alpha.1', 'beta.1', 'rc.1'];

    for (const suffix of suffixes) {
      const version = `1.0.0-${suffix}`;
      const brand = new SkyThemeBrand('custom-brand', version);
      expect(brand.version).toBe(version);
    }
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

  describe('serialization', () => {
    it('should serialize brand with default hostClass correctly', () => {
      const brand = new SkyThemeBrand('rainbow', '1.0.0');
      const serialized = brand.serialize();

      // hostClass should be omitted since it matches the default hostClass.
      expect(serialized).toEqual({
        name: 'rainbow',
        version: '1.0.0',
      });
    });

    it('should serialize brand with custom hostClass correctly', () => {
      const brand = new SkyThemeBrand('custom', '2.0.0', 'custom-host-class');
      const serialized = brand.serialize();

      // hostClass should be included since it doesn't match the default hostClass.
      expect(serialized).toEqual({
        name: 'custom',
        version: '2.0.0',
        hostClass: 'custom-host-class',
      });
    });

    it('should serialize brand with styleUrl correctly', () => {
      const styleUrl = 'https://example.com/styles.css';
      const brand = new SkyThemeBrand('custom', '2.0.0', undefined, styleUrl);
      const serialized = brand.serialize();

      expect(serialized).toEqual({
        name: 'custom',
        version: '2.0.0',
        styleUrl,
      });
    });

    it('should serialize brand with sriHash correctly', () => {
      const sriHash = 'sha384-abc123def456';
      const brand = new SkyThemeBrand('custom', '2.0.0', undefined, undefined, sriHash);
      const serialized = brand.serialize();

      expect(serialized).toEqual({
        name: 'custom',
        version: '2.0.0',
        sriHash,
      });
    });

    it('should serialize brand with all properties correctly', () => {
      const styleUrl = 'https://example.com/styles.css';
      const sriHash = 'sha384-abc123def456';
      const brand = new SkyThemeBrand('custom', '2.0.0', 'custom-host-class', styleUrl, sriHash);
      const serialized = brand.serialize();

      expect(serialized).toEqual({
        name: 'custom',
        version: '2.0.0',
        hostClass: 'custom-host-class',
        styleUrl,
        sriHash,
      });
    });

    it('should deserialize brand correctly', () => {
      const brand = SkyThemeBrand.deserialize({
        name: 'rainbow',
        version: '1.0.0',
      });

      expect(brand.name).toBe('rainbow');
      expect(brand.version).toBe('1.0.0');
      expect(brand.hostClass).toBe('sky-theme-brand-rainbow');
    });

    it('should deserialize brand with custom hostClass correctly', () => {
      const brand = SkyThemeBrand.deserialize({
        name: 'custom',
        version: '2.0.0',
        hostClass: 'custom-host-class',
      });

      expect(brand.name).toBe('custom');
      expect(brand.version).toBe('2.0.0');
      expect(brand.hostClass).toBe('custom-host-class');
    });

    it('should deserialize brand with styleUrl correctly', () => {
      const styleUrl = 'https://example.com/styles.css';
      const brand = SkyThemeBrand.deserialize({
        name: 'custom',
        version: '2.0.0',
        styleUrl,
      });

      expect(brand.name).toBe('custom');
      expect(brand.version).toBe('2.0.0');
      expect(brand.hostClass).toBe('sky-theme-brand-custom');
      expect(brand.styleUrl).toBe(styleUrl);
    });

    it('should deserialize brand with sriHash correctly', () => {
      const sriHash = 'sha384-abc123def456';
      const brand = SkyThemeBrand.deserialize({
        name: 'custom',
        version: '2.0.0',
        sriHash,
      });

      expect(brand.name).toBe('custom');
      expect(brand.version).toBe('2.0.0');
      expect(brand.hostClass).toBe('sky-theme-brand-custom');
      expect(brand.sriHash).toBe(sriHash);
    });

    it('should deserialize brand with all properties correctly', () => {
      const styleUrl = 'https://example.com/styles.css';
      const sriHash = 'sha384-abc123def456';
      const brand = SkyThemeBrand.deserialize({
        name: 'custom',
        version: '2.0.0',
        hostClass: 'custom-host-class',
        styleUrl,
        sriHash,
      });

      expect(brand.name).toBe('custom');
      expect(brand.version).toBe('2.0.0');
      expect(brand.hostClass).toBe('custom-host-class');
      expect(brand.styleUrl).toBe(styleUrl);
      expect(brand.sriHash).toBe(sriHash);
    });
  });
});
