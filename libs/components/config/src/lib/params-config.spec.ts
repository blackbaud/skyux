import { SkyAppParamsConfig } from './params-config';

describe('SkyAppParamsConfig', () => {
  it('should return defaults', () => {
    const config = new SkyAppParamsConfig();
    expect(config.params).toEqual({
      envid: {
        required: false,
      },
      leid: {
        required: false,
      },
      svcid: {
        required: false,
      },
    });
  });

  it('should allow params overrides', () => {
    const config = new SkyAppParamsConfig({
      params: {
        foo: {
          value: 'bar',
        },
      },
    });
    expect(config.params).toEqual({
      envid: {
        required: false,
      },
      foo: {
        value: 'bar',
      },
      leid: {
        required: false,
      },
      svcid: {
        required: false,
      },
    });
  });
});
