import { getLibStringForLocale } from './get-lib-string-for-locale';
import { SkyLibResources } from './lib-resources';

describe('Get library string', () => {
  let resources: Record<string, SkyLibResources>;

  beforeEach(() => {
    resources = {
      'EN-US': {
        foo: {
          message: 'bar',
        },
      },
      ES: {
        foo: {
          message: 'ejemplo',
        },
      },
      FIL: {
        foo: {
          message: 'halimbawa',
        },
      },
      SR: {
        foo: {
          message: 'primer',
        },
      },
      'SR-LATN-RS': {
        foo: {
          message: 'primer (latinica)',
        },
      },
    };
  });

  it('should return a string paired to a key', () => {
    const result = getLibStringForLocale(resources, 'EN-US', 'foo');
    expect(result).toEqual('bar');
  });

  it('should return a default string if locale not supported', () => {
    const result = getLibStringForLocale(resources, 'FR-CA', 'foo');
    expect(result).toEqual('bar');
  });

  it('should return undefined if the key does not exist', () => {
    const result = getLibStringForLocale(resources, 'EN-US', 'invalid');
    expect(result).toBeUndefined();
  });

  it('should handle mixed-case locales', () => {
    const result = getLibStringForLocale(resources, 'en-us', 'foo');
    expect(result).toEqual('bar');
  });

  it('should handle non-region locales', () => {
    const result = getLibStringForLocale(resources, 'es-mx', 'foo');
    expect(result).toEqual('ejemplo');
  });

  it('should handle 3-letter language tags (e.g. fil-PH)', () => {
    const result = getLibStringForLocale(resources, 'fil-PH', 'foo');
    expect(result).toEqual('halimbawa');
  });

  it('should handle locales with multiple underscores (e.g. sr_Latn_RS)', () => {
    const result = getLibStringForLocale(resources, 'sr_Latn_RS', 'foo');
    expect(result).toEqual('primer (latinica)');
  });

  it('should fall back to the language tag when the full locale is not supported', () => {
    const result = getLibStringForLocale(resources, 'sr_Cyrl_RS', 'foo');
    expect(result).toEqual('primer');
  });
});
