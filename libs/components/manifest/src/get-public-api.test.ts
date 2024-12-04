describe('get-public-api', () => {
  it('should return the public API', async () => {
    const publicApi = {
      packages: {
        '@company/components': {},
      },
    };

    jest.mock('../public-api.json', () => publicApi);

    const { getPublicApi } = await import('./get-public-api');

    const result = getPublicApi();

    expect(result).toEqual(publicApi);
  });
});
