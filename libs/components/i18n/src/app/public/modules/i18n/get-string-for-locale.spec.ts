import {
  getStringForLocale
} from './get-string-for-locale';

describe('Get string', () => {
  let resources: any;

  beforeEach(() => {
    resources = {
      'EN-US': {
        'foo': 'bar'
      }
    };
  });

  it('should return a string paired to a key', () => {
    const result = getStringForLocale(resources, 'EN-US', 'foo');
    expect(result).toEqual('bar');
  });

  it('should return a default string if locale not supported', () => {
    const result = getStringForLocale(resources, 'FR-CA', 'foo');
    expect(result).toEqual('bar');
  });

  it('should return an empty string if the key does not exist', () => {
    const result = getStringForLocale(resources, 'EN-US', 'invalid');
    expect(result).toEqual('');
  });

  it('should handle mixed-case locales', () => {
    const result = getStringForLocale(resources, 'en-us', 'foo');
    expect(result).toEqual('bar');
  });
});
