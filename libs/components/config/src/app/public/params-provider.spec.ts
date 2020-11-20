import {
  SkyAppParamsConfig
} from './params-config';

import {
  SkyAppRuntimeConfigParamsProvider
} from './params-provider';

describe('SkyAppRuntimeConfigParamsProvider', () => {

  it('should return runtime params', () => {
    const config = new SkyAppParamsConfig({
      params: {
        envid: {
          value: 'foobar'
        }
      }
    });

    const provider = new SkyAppRuntimeConfigParamsProvider(config);

    expect(provider.params.get('envid')).toEqual('foobar');
  });

});
