import { SkyAppRuntimeConfigParams } from './params';

describe('SkyAppRuntimeConfigParams', () => {

  const allowed = [
    'a1',
    'a3'
  ];

  it('should parse allowed params from a url', () => {
    const params: SkyAppRuntimeConfigParams = new SkyAppRuntimeConfigParams(
      'https://example.com/?a1=a&b2=jkl&a3=b',
      allowed
    );

    expect(params.getAllKeys()).toEqual(['a1', 'a3']);
    expect(params.get('a1')).toEqual('a');
    expect(params.get('b2')).not.toEqual('jkl');
    expect(params.get('a3')).toEqual('b');
    expect(params.getAll()).toEqual({
      a1: 'a',
      a3: 'b'
    });
  });

  it('should only let allowed params be set', () => {
    const params: SkyAppRuntimeConfigParams = new SkyAppRuntimeConfigParams(
      '?a1=b&b2=c',
      allowed
    );
    expect(params.get('a1')).toEqual('b');
    expect(params.get('b2')).not.toEqual('c');
  });

  it('should add the current params to a url with a querystring', () => {
    const params: SkyAppRuntimeConfigParams = new SkyAppRuntimeConfigParams(
      '?a1=b',
      allowed
    );
    expect(params.getUrl('https://mysite.com?c=d')).toEqual('https://mysite.com?c=d&a1=b');
  });

  it('should exclude certain parameters from being added to a url\'s querystring', () => {
    const params: SkyAppRuntimeConfigParams = new SkyAppRuntimeConfigParams(
      '?a1=b&b2=c3&z4=y',
      {
        'a1': true,
        'b2': {
          required: true
        },
        'z4': {
          excludeFromRequests: true
        }
      }
    );

    expect(params.getUrl('https://mysite.com?c=d')).toEqual('https://mysite.com?c=d&a1=b&b2=c3');
  });

  it('should not add a current param if the url already has it', () => {
    const params: SkyAppRuntimeConfigParams = new SkyAppRuntimeConfigParams(
      '?a1=b',
      allowed
    );
    expect(params.getUrl('https://mysite.com?a1=c&a3=e')).toEqual('https://mysite.com?a1=c&a3=e');
  });

  it('should add the current params to a url without a querystring', () => {
    const params: SkyAppRuntimeConfigParams = new SkyAppRuntimeConfigParams(
      '?a1=b',
      allowed
    );
    expect(params.getUrl('https://mysite.com')).toEqual('https://mysite.com?a1=b');
  });

  it('should return the current url if no params set (do not add ?)', () => {
    const params: SkyAppRuntimeConfigParams = new SkyAppRuntimeConfigParams(
      '',
      allowed
    );
    expect(params.getUrl('https://mysite.com')).toEqual('https://mysite.com');
  });

  it('should not add double-encoded params to a url', () => {
    const params: SkyAppRuntimeConfigParams = new SkyAppRuntimeConfigParams(
      '?a1=%2F',
      allowed
    );
    expect(params.getUrl('https://mysite.com')).toEqual('https://mysite.com?a1=%2F');
  });

  it('should allow querystring param keys to be case insensitive', () => {
    const params: SkyAppRuntimeConfigParams = new SkyAppRuntimeConfigParams(
      '?A1=b&A3=c',
      allowed
    );
    expect(params.get('a1')).toEqual('b');
    expect(params.get('a3')).toEqual('c');
  });

  it('should expose a `has` method for testing if a param exists', () => {
    const params: SkyAppRuntimeConfigParams = new SkyAppRuntimeConfigParams(
      '?a1=b&a2=c',
      allowed
    );
    expect(params.has('a1')).toEqual(true);
    expect(params.has('a2')).toEqual(false);
    expect(params.has('a3')).toEqual(false);
  });

  it('should allow default values to be specified', () => {
    const params: SkyAppRuntimeConfigParams = new SkyAppRuntimeConfigParams(
      '?a1=b&a2=c&a4=x',
      {
        // Allowed with simple boolean flag
        a1: true,
        // Disallowed but present in the query string
        a2: undefined,
        // Allowed with explicit default value
        a3: {
          value: 'd'
        },
        // Allowed with explicit default value of undefined
        a4: {
          value: undefined
        }
      }
    );

    expect(params.get('a1')).toBe('b');
    expect(params.get('a2')).toBe(undefined);
    expect(params.get('a3')).toBe('d');
    expect(params.get('a4')).toBe('x');
    expect(params.get('a5')).toBe(undefined);
  });

  it('should allow default values to be overridden by the query string', () => {
    const params: SkyAppRuntimeConfigParams = new SkyAppRuntimeConfigParams(
      '?a1=b&a2=c',
      {
        a1: {
          value: 'x'
        },
        a2: {}
      }
    );

    expect(params.get('a1')).toBe('b');
    expect(params.get('a2')).toBe('c');
  });

  it('should support excluding default values in getAll() if specified', () => {
    const params: SkyAppRuntimeConfigParams = new SkyAppRuntimeConfigParams(
      '?a2=a2Value&a3=a3CustomValue',
      {
        // Allowed with simple boolean flag
        a1: {
          value: 'a1DefaultValue'
        },
        a2: true,
        a3: {
          value: 'a3DefaultValue'
        }
      }
    );

    expect(params.getAll(true)).toEqual({
      a2: 'a2Value',
      a3: 'a3CustomValue'
    });
  });

  it('should allow values to be decoded when retrieved from the query string', () => {
    const params = new SkyAppRuntimeConfigParams(
      '?a=%2F',
      {
        a: true,
        b: {
          value: '%2F'
        }
      }
    );

    // Preserves previous behavior of not encoding values from the query string.
    expect(params.get('a')).toBe('%2F');
    expect(params.get('b')).toBe('%2F');

    // The second parameter tells the get() method to decode the parameter if it's from the
    // query string.
    expect(params.get('a', true)).toBe('/');
    expect(params.get('b', true)).toBe('%2F');
  });

  it('should allow queryparam values to be required', () => {
    const params: SkyAppRuntimeConfigParams = new SkyAppRuntimeConfigParams(
      '',
      {
        a1: {
          value: 'test',
          required: true
        }
      }
    );

    expect(params.hasAllRequiredParams()).toBe(true);
  });

  it('should expose a `hasAllRequiredParams` method for testing if all required params are defined', () => {
    const params: SkyAppRuntimeConfigParams = new SkyAppRuntimeConfigParams(
      '',
      {
        a1: {
          required: true
        }
      }
    );

    expect(params.hasAllRequiredParams()).toBe(false);
  });

  it('should expose a `hasAllRequiredParams` method that returns true if no required params are defined', () => {
    const params: SkyAppRuntimeConfigParams = new SkyAppRuntimeConfigParams(
      '',
      {
        a1: true
      }
    );

    expect(params.hasAllRequiredParams()).toBe(true);
  });

  it('should expose a `hasAllRequiredParams` method that returns false if any required params are undefined', () => {
    const params: SkyAppRuntimeConfigParams = new SkyAppRuntimeConfigParams(
      '',
      {
        a1: {
          value: '1',
          required: true
        },
        a2: {
          required: true
        }
      }
    );

    expect(params.hasAllRequiredParams()).toBe(false);
  });

  it('should handle a url with a querystring and fragment (#)', () => {
    const params: SkyAppRuntimeConfigParams = new SkyAppRuntimeConfigParams(
      '?A1=b&A3=c#hash-better=have-my-money',
      allowed
    );
    expect(params.get('a1')).toEqual('b');
    expect(params.get('a3')).toEqual('c');
    expect(params.getUrl('example.com')).not.toContain('hash-better=have-my-money');
  });

  it('should ignore params in a fragment', () => {
    const params: SkyAppRuntimeConfigParams = new SkyAppRuntimeConfigParams(
      'https://example.com#A1=b',
      allowed
    );

    expect(params.get('a1')).not.toEqual('b');
  });

  it('should handle a url without a querystring', () => {
    const params: SkyAppRuntimeConfigParams = new SkyAppRuntimeConfigParams(
      'https://example.com',
      allowed
    );

    expect(params.getAllKeys()).toEqual([]);
  });

});
