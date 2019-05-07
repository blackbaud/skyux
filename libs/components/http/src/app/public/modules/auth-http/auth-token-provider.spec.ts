//#region imports

import {
  BBAuth
} from '@blackbaud/auth-client';

import {
  SkyAuthToken
} from './auth-token';

import {
  SkyAuthTokenProvider
} from './auth-token-provider';

//#endregion

describe('Auth token provider', () => {

  let testToken: string;

  let testDecodedToken: SkyAuthToken;

  beforeEach(() => {
    testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
      '.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZ2l2ZW5fbmFtZSI6IkpvaG4iLCJmYW1pbHl' + 'fbmFtZSI6IkRvZSIsImlhdCI6MTUxNjIzOTAyMn0' +
      '.M44YpCNOgfbfofdWeIGLHoMwmeKAEibhDIcDCgRM5Nc';

    testDecodedToken = {
      sub: '1234567890',
      given_name: 'John',
      family_name: 'Doe',
      iat: 1516239022
    };
  });

  describe('getToken() method', () => {

    it('should call BBAuth.getToken and add return its promise', (done) => {
      spyOn(BBAuth, 'getToken')
        .and
        .returnValue(Promise.resolve(testToken));

      const provider = new SkyAuthTokenProvider();

      provider.getToken().then((token) => {
        expect(token).toBe(testToken);
        done();
      });
    });

  });

  describe('getDecodedToken() method', () => {

    it('should return a decoded token', (done) => {
      spyOn(BBAuth, 'getToken')
        .and
        .returnValue(Promise.resolve(testToken));

      const provider = new SkyAuthTokenProvider();

      provider.getDecodedToken().then((token) => {
        expect(token).toEqual(testDecodedToken);

        done();
      });
    });

  });

  describe('getContextToken() method', () => {

    it('should call BBAuth.getToken() with the SPA\'s context parameters', () => {
      const getTokenSpy = spyOn(BBAuth, 'getToken');

      let provider = new SkyAuthTokenProvider({
        runtime: {
          params: {
            get: (name: string) => {
              switch (name) {
                case 'envid':
                  return 'test-envid';
                default:
                  return undefined;
              }
            }
          }
        }
      } as any);

      provider.getContextToken();

      expect(getTokenSpy).toHaveBeenCalledWith({
        envId: 'test-envid'
      });

      provider = new SkyAuthTokenProvider({
        runtime: {
          params: {
            get: (name: string) => {
              switch (name) {
                case 'leid':
                  return 'test-leid';
                default:
                  return undefined;
              }
            }
          }
        }
      } as any);

      provider.getContextToken();

      expect(getTokenSpy).toHaveBeenCalledWith({
        leId: 'test-leid'
      });
    });

    it('should handle missing config', () => {
      const getTokenSpy = spyOn(BBAuth, 'getToken');

      const provider = new SkyAuthTokenProvider();

      provider.getContextToken();

      expect(getTokenSpy).toHaveBeenCalledWith({});
    });

    it('should add permission scope to the request if specified', () => {
      const getTokenSpy = spyOn(BBAuth, 'getToken');

      const provider = new SkyAuthTokenProvider();

      provider.getContextToken({
        permissionScope: 'abc'
      });

      expect(getTokenSpy).toHaveBeenCalledWith({
        permissionScope: 'abc'
      });
    });

  });

  describe('getDecodedContextToken() method', () => {

    it(
      'should call BBAuth.getToken() with the SPA\'s context parameters and decode the token',
      (done) => {
        const getTokenSpy = spyOn(BBAuth, 'getToken')
          .and
          .returnValue(Promise.resolve(testToken));

        const provider = new SkyAuthTokenProvider({
          runtime: {
            params: {
              get: (name: string) => {
                switch (name) {
                  case 'leid':
                    return 'test-leid';
                  default:
                    return undefined;
                }
              }
            }
          }
        } as any);

        provider.getDecodedContextToken({
          permissionScope: 'xyz'
        }).then((token) => {
          expect(getTokenSpy).toHaveBeenCalledWith({
            leId: 'test-leid',
            permissionScope: 'xyz'
          });

          expect(token).toEqual(testDecodedToken);

          done();
        });
      }
    );

  });

});
