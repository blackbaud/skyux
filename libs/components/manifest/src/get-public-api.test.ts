import { afterEach, describe, expect, it, vi } from 'vitest';

const publicApiJson = {
  packages: {},
};

vi.mock('../public-api.json', () => ({ default: publicApiJson }));

describe('get-public-api', () => {
  afterEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
  });

  it('should return the public API', async () => {
    publicApiJson.packages = {
      '@company/components': {},
    };

    const { getPublicApi } = await import('./get-public-api.js');

    const result = getPublicApi();

    expect(result).toEqual(publicApiJson);
  });
});
