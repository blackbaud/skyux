function setup(options: { publicApi: Record<string, unknown> }): void {
  jest.mock('../public-api.json', () => options.publicApi);
}

describe('get-public-api', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should return the public API', async () => {
    const publicApi = {
      packages: {
        '@company/components': {},
      },
    };

    setup({ publicApi });

    const { getPublicApi } = await import('./get-public-api');

    const result = getPublicApi();

    expect(result).toEqual(publicApi);
  });

  it('should filter the public API by tags', async () => {
    const publicApi = {
      packages: {
        '@company/components': [
          {
            name: 'foo',
            tags: ['bar'],
          },
        ],
        '@company/other': [
          {
            name: 'bar',
            tags: ['bar'],
          },
        ],
        '@company/no-tags': [
          {
            name: 'baz',
          },
        ],
      },
    };

    setup({ publicApi });

    const { getPublicApi } = await import('./get-public-api');

    const result = getPublicApi({ tags: ['bar'] });

    expect(result).toEqual({
      packages: {
        '@company/components': [
          {
            name: 'foo',
            tags: ['bar'],
          },
        ],
        '@company/other': [
          {
            name: 'bar',
            tags: ['bar'],
          },
        ],
      },
    });
  });

  it('should filter by internal', async () => {
    const publicApi = {
      packages: {
        '@company/components': [
          {
            name: 'foo',
            isInternal: true,
          },
        ],
        '@company/other': [
          {
            name: 'bar',
            isInternal: false,
          },
        ],
      },
    };

    setup({ publicApi });

    const { getPublicApi } = await import('./get-public-api');

    const result = getPublicApi({ excludeInternal: true });

    expect(result).toEqual({
      packages: {
        '@company/other': [
          {
            name: 'bar',
            isInternal: false,
          },
        ],
      },
    });
  });

  it('should filter by tags and internal', async () => {
    const publicApi = {
      packages: {
        '@company/components': [
          {
            name: 'foo',
            tags: ['bar'],
            isInternal: true,
          },
        ],
        '@company/other': [
          {
            name: 'bar',
            tags: ['bar'],
            isInternal: false,
          },
        ],
      },
    };

    setup({ publicApi });

    const { getPublicApi } = await import('./get-public-api');

    const result = getPublicApi({ tags: ['bar'], excludeInternal: true });

    expect(result).toEqual({
      packages: {
        '@company/other': [
          {
            name: 'bar',
            tags: ['bar'],
            isInternal: false,
          },
        ],
      },
    });
  });
});
