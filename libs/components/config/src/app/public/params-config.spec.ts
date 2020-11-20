import {
  SkyAppParamsConfig
} from './params-config';

describe('SkyAppParamsConfig', () => {

  it('should return defaults', () => {
    const config = new SkyAppParamsConfig();
    expect(config.params).toEqual({
      envid: {
        required: false
      },
      leid: {
        required: false
      },
      svcid: {
        required: false
      }
    });
  });

});
