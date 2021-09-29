import {
  SkyAppConfigParams
} from './app-config-params';

import {
  SkyAppRuntimeConfigParamsProvider
} from './params-provider';

describe('SkyAppRuntimeConfigParamsProvider', () => {

  it('should return runtime params', () => {
    const config = new SkyAppConfigParams();
    config.init({
      envid: {
        value: 'foobar'
      }
    });

    const provider = new SkyAppRuntimeConfigParamsProvider(config);

    expect(provider.params.get('envid')).toEqual('foobar');
  });

  it('should set defaults', () => {
    const provider = new SkyAppRuntimeConfigParamsProvider();
    expect(provider.params.getAll()).toEqual({});
  });

});
