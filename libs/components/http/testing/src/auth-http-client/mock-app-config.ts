/**
 * @internal
 */
export class SkyMockAppConfig {
  public runtime = {
    app: {
      name: 'test',
    },
    params: {
      getUrl: (url: string) => url,
      get: (key: string) => {
        if (key === 'svcid') {
          return 'test-svcid';
        }

        return undefined;
      },
    },
  };
}
