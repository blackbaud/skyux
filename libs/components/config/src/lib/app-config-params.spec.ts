import { SkyAppConfigParams } from './app-config-params';

describe('SkyAppConfigParams', () => {
  it('should return defaults', () => {
    const config = new SkyAppConfigParams();
    config.init();
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

  it('should extend custom params', () => {
    const config = new SkyAppConfigParams();
    config.init({
      foo: {
        required: true,
      },
    });
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
      foo: {
        required: true,
      },
    });
  });
});
