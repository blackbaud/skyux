import {
  BBAuthClientFactory
} from '@skyux/auth-client-factory';

import {
  SkyAuthContextArgs
} from './auth-context-args';

import {
  SkyAuthContextProvider
} from './auth-context-provider';

describe('Auth context provider', () => {

  it('should call BBContextProvider.ensureContext', async () => {
    const factorySpy = spyOn(BBAuthClientFactory.BBContextProvider, 'ensureContext')
      .and
      .returnValue(Promise.resolve({}));

      const args: SkyAuthContextArgs = {
        envId: 'foobar'
      };

      const provider = new SkyAuthContextProvider();

      await provider.ensureContext(args);

      expect(factorySpy).toHaveBeenCalledWith(args);
  });

});
