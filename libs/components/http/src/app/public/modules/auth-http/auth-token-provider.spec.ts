import { BBAuth } from '@blackbaud/auth-client';

import { SkyAuthTokenProvider } from './auth-token-provider';

describe('Auth token provider', () => {

  it('should call BBAuth.getToken and add return its promise', (done) => {
    const expectedToken = 'my-fake-token';

    spyOn(BBAuth, 'getToken')
      .and
      .returnValue(Promise.resolve(expectedToken));

    const provider = new SkyAuthTokenProvider();

    provider.getToken().then((token: string) => {
      expect(token).toBe(expectedToken);
      done();
    });
  });

});
