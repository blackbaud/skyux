export class SkyMockAppConfig {
  public runtime = {
    app: {
      name: 'test',
    },
    params: {
      getUrl: (url: string) => url,
    },
  };
}
