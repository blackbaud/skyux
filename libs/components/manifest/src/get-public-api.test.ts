describe('get-public-api', () => {
  function setup(options: { publicApi: Record<string, unknown> }): void {
    jest.mock('../public-api.json', () => options.publicApi);
  }

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

  it('should return the public API for a specific docs ID', async () => {
    const publicApi = {
      packages: {
        '@company/components': [
          {
            docsId: 'foo',
            isInternal: false,
          },
          {
            docsId: 'bar',
            isInternal: false,
            docsIncludeIds: ['foo', 'FooTesting', 'FooTestingInternal'],
          },
          {
            docsId: 'ignored',
            isInternal: false,
          },
        ],
        '@company/components/testing': [
          {
            docsId: 'FooTesting',
            isInternal: false,
          },
          {
            docsId: 'FooTestingInternal',
            isInternal: true,
          },
        ],
      },
    };

    setup({ publicApi });

    const { getPublicApiByDocsId } = await import('./get-public-api');

    const result = getPublicApiByDocsId('bar');

    expect(result).toMatchSnapshot();
  });
});
