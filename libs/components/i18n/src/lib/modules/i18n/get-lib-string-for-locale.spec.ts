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
});
