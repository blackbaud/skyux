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
});
