//#region imports
import { BBAuthClientFactory } from '@skyux/auth-client-factory';

import { SkyAuthToken } from './auth-token';
import { SkyAuthTokenProvider } from './auth-token-provider';

//#endregion

describe('Auth token provider', () => {
  let testToken: string;

  let testDecodedToken: SkyAuthToken;

  beforeEach(() => {
    /* spell-checker:disable */
    testToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
      '.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZ2l2ZW5fbmFtZSI6IkpvaG4iLCJmYW1pbHl' +
      'fbmFtZSI6IkRvZSIsImlhdCI6MTUxNjIzOTAyMn0' +
      '.M44YpCNOgfbfofdWeIGLHoMwmeKAEibhDIcDCgRM5Nc';
    /* spell-checker:enable */

    testDecodedToken = {
      sub: '1234567890',
      given_name: 'John',
      family_name: 'Doe',
      iat: 1516239022,
    };
  });

  describe('getToken() method', () => {
    it('should call BBAuth.getToken and add return its promise', (done) => {
      spyOn(BBAuthClientFactory.BBAuth, 'getToken').and.returnValue(
        Promise.resolve(testToken),
      );

      const provider = new SkyAuthTokenProvider();

      provider.getToken().then((token) => {
        expect(token).toBe(testToken);
        done();
      });
    });
  });

  describe('getDecodedToken() method', () => {
    it('should return a decoded token', (done) => {
      spyOn(BBAuthClientFactory.BBAuth, 'getToken').and.returnValue(
        Promise.resolve(testToken),
      );

      const provider = new SkyAuthTokenProvider();

      provider.getDecodedToken().then((token) => {
        expect(token).toEqual(testDecodedToken);

        done();
      });
    });
  });

  describe('getContextToken() method', () => {
    describe("when calling BBAuth.getToken() with the SPA's context parameters", () => {
      it('should include environment id', () => {
        const getTokenSpy = spyOn(BBAuthClientFactory.BBAuth, 'getToken');
        const provider = new SkyAuthTokenProvider({
          runtime: {
            params: {
              get: (name: string) => {
                switch (name) {
                  case 'envid':
                    return 'test-envid';
                  default:
                    return undefined;
                }
              },
            },
          },
        } as any);

        provider.getContextToken();

        expect(getTokenSpy).toHaveBeenCalledWith({
          envId: 'test-envid',
        });
      });

      it('should include legal entity id', () => {
        const getTokenSpy = spyOn(BBAuthClientFactory.BBAuth, 'getToken');
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
              },
            },
          },
        } as any);

        provider.getContextToken();

        expect(getTokenSpy).toHaveBeenCalledWith({
          leId: 'test-leid',
        });
      });

      it('should include service id', () => {
        const getTokenSpy = spyOn(BBAuthClientFactory.BBAuth, 'getToken');
        const provider = new SkyAuthTokenProvider({
          runtime: {
            params: {
              get: (name: string) => {
                switch (name) {
                  case 'svcid':
                    return 'test-svcid';
                  default:
                    return undefined;
                }
              },
            },
          },
        } as any);

        provider.getContextToken();

        expect(getTokenSpy).toHaveBeenCalledWith({
          svcId: 'test-svcid',
        });
      });

      it('should include full context', () => {
        const getTokenSpy = spyOn(BBAuthClientFactory.BBAuth, 'getToken');
        const provider = new SkyAuthTokenProvider({
          runtime: {
            params: {
              get: (name: string) => {
                switch (name) {
                  case 'envid':
                    return 'test-envid';
                  case 'leid':
                    return 'test-leid';
                  case 'svcid':
                    return 'test-svcid';
                  default:
                    return undefined;
                }
              },
            },
          },
        } as any);

        provider.getContextToken();

        expect(getTokenSpy).toHaveBeenCalledWith({
          envId: 'test-envid',
          leId: 'test-leid',
          svcId: 'test-svcid',
        });
      });
    });

    it('should handle missing config', () => {
      const getTokenSpy = spyOn(BBAuthClientFactory.BBAuth, 'getToken');

      const provider = new SkyAuthTokenProvider();

      provider.getContextToken();

      expect(getTokenSpy).toHaveBeenCalledWith({});
    });

    it('should add permission scope to the request if specified', () => {
      const getTokenSpy = spyOn(BBAuthClientFactory.BBAuth, 'getToken');

      const provider = new SkyAuthTokenProvider();

      provider.getContextToken({
        permissionScope: 'abc',
      });

      expect(getTokenSpy).toHaveBeenCalledWith({
        permissionScope: 'abc',
      });
    });
  });

  describe('getDecodedContextToken() method', () => {
    let testParams: any;

    function validate(provider: SkyAuthTokenProvider, done: DoneFn): void {
      const getTokenSpy = spyOn(
        BBAuthClientFactory.BBAuth,
        'getToken',
      ).and.returnValue(Promise.resolve(testToken));

      provider
        .getDecodedContextToken({
          permissionScope: 'xyz',
        })
        .then((token) => {
          expect(getTokenSpy).toHaveBeenCalledWith({
            leId: 'test-leid',
            permissionScope: 'xyz',
          });

          expect(token).toEqual(testDecodedToken);

          done();
        });
    }

    beforeEach(() => {
      testParams = {
        get: (name: string): string | undefined => {
          switch (name) {
            case 'leid':
              return 'test-leid';
            default:
              return undefined;
          }
        },
      };
    });

    it("should call BBAuth.getToken() with the SPA's context parameters and decode the token", (done) => {
      const provider = new SkyAuthTokenProvider({
        runtime: {
          params: testParams,
        },
      } as any);

      validate(provider, done);
    });

    it('should fall back to the params provider if no config is provided', (done) => {
      const provider = new SkyAuthTokenProvider(undefined, {
        params: testParams,
      } as any);

      validate(provider, done);
    });
  });
});
