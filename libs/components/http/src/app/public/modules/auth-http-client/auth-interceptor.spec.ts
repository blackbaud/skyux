//#region imports

import {
  HttpHandler
} from '@angular/common/http';

import {
  TestBed
} from '@angular/core/testing';

import {
  SkyAppConfig,
  SkyAppRuntimeConfigParams
} from '@skyux/config';

import {
  SkyAuthInterceptor
} from './auth-interceptor';

import {
  SKY_AUTH_DEFAULT_PERMISSION_SCOPE
} from './auth-interceptor-default-permission-scope';

import {
  SkyAuthTokenContextArgs
} from './auth-token-context-args';

import {
  SkyAuthTokenProvider
} from './auth-token-provider';

import {
  createAppConfig,
  createRequest,
  EXAMPLE_URL,
  Spy,
  validateRequest
} from './testing/sky-http-interceptor.test-utils';

//#endregion

describe('Auth interceptor', () => {
  let mockTokenProvider: Spy<SkyAuthTokenProvider>;
  let mockRuntimeConfigParameters: Spy<SkyAppRuntimeConfigParams>;
  let config: SkyAppConfig;
  let next: Spy<HttpHandler>;

  function createInteceptor(envId?: string, leId?: string, getUrlResult?: string) {
    return new SkyAuthInterceptor(mockTokenProvider as any,
      createAppConfig(envId, leId, getUrlResult));
  }

  function validateContext(
    envId: string,
    leId: string,
    permissionScope: string,
    expectedUrl: string,
    done: DoneFn
  ): void {
    mockRuntimeConfigParameters.get.and.callFake((name: any) => {
      switch (name) {
        case 'envid':
          return envId;
        case 'leid':
          return leId;
        default:
          return undefined;
      }
    });

    mockRuntimeConfigParameters.getUrl.and.callFake(() => {
      return expectedUrl || EXAMPLE_URL;
    });

    const request = createRequest(true, undefined, permissionScope);

    const interceptor: SkyAuthInterceptor = TestBed.get(SkyAuthInterceptor);
    interceptor.intercept(request, next);

    validateRequest(next, done, (authRequest) => {
      expect(authRequest.url).toBe(expectedUrl);
    });

    interceptor.intercept(request, next).subscribe(() => {});

    const expectedTokenArgs: SkyAuthTokenContextArgs = {};

    if (permissionScope) {
      expectedTokenArgs.permissionScope = permissionScope;
    }

    expect(mockTokenProvider.getContextToken).toHaveBeenCalledWith(
      jasmine.objectContaining(expectedTokenArgs)
    );
  }

  beforeEach(() => {
    mockTokenProvider = jasmine.createSpyObj(
      'SkyAuthTokenProvider',
      ['getContextToken', 'decodeToken']
    );

    mockTokenProvider.getContextToken.and.returnValue(Promise.resolve('abc'));

    mockTokenProvider.decodeToken.and.returnValue({
      '1bb.zone': 'p-can01'
    });

    mockRuntimeConfigParameters = jasmine.createSpyObj(
      'RuntimeConfigParameters',
      ['get', 'getUrl']
    );

    config = {
      runtime: {
        params: mockRuntimeConfigParameters
      } as any,
      skyux: {}
    };

    next = jasmine.createSpyObj('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: SkyAuthTokenProvider,
          useValue: mockTokenProvider
        },
        {
          provide: SkyAppConfig,
          useValue: config
        },
        SkyAuthInterceptor
      ]
    });
  });

  it('should pass through the existing request when not an auth request', () => {
    const interceptor: SkyAuthInterceptor = TestBed.get(SkyAuthInterceptor);
    const request = createRequest();

    next.handle.and.stub();

    interceptor.intercept(request, next);

    expect(next.handle).toHaveBeenCalledWith(request);
  });

  it('should add a token to the request if the sky_auth parameter is set', (done) => {
    const interceptor: SkyAuthInterceptor = TestBed.get(SkyAuthInterceptor);
    const request = createRequest(true);

    validateRequest(next, done, (authRequest) => {
      expect(authRequest.headers.get('Authorization')).toBe('Bearer abc');
    });

    interceptor.intercept(request, next).subscribe(() => {});
  });

  it('should add a permission scope to the token request if specified', (done) => {
    validateContext(undefined, undefined, '123', EXAMPLE_URL, done);
  });

  it('should apply the appropriate environment context', (done) => {
    validateContext('abc', undefined, undefined, `${EXAMPLE_URL}?envid=abc`, done);
  });

  it('should apply the appropriate legal entity context', (done) => {
    validateContext(undefined, 'abc', undefined, `${EXAMPLE_URL}?leid=abc`, done);
  });

  it('should convert tokenized urls and honor the hard-coded zone.', (done) => {
    const interceptor = createInteceptor();

    const request = createRequest(
      true,
      '1bb://eng-hub00-pusa01/version'
    );

    validateRequest(next, done, (authRequest) => {
      expect(authRequest.url).toBe('https://eng-pusa01.app.blackbaud.net/hub00/version');
    });

    interceptor.intercept(request, next).subscribe(() => {});
  });

  it('should convert tokenized urls and get zone from the token.', (done) => {
    const interceptor = createInteceptor();

    const request = createRequest(
      true,
      '1bb://eng-hub00/version'
    );

    validateRequest(next, done, (authRequest) => {
      expect(authRequest.url).toBe('https://eng-pcan01.app.blackbaud.net/hub00/version');
    });

    interceptor.intercept(request, next).subscribe(() => {});
  });

  it('should add the default permission scope if it is injected and a scope is not passed in',
    (done) => {
      const defaultPermissionScope = 'default-permission-scope';

      TestBed.configureTestingModule({
        providers: [
          {
            provide: SKY_AUTH_DEFAULT_PERMISSION_SCOPE,
            useValue: defaultPermissionScope
          }
        ]
      });

      const interceptor = TestBed.get(SkyAuthInterceptor);
      const request = createRequest(true);
      const expectedTokenArgs: SkyAuthTokenContextArgs = {permissionScope: defaultPermissionScope};

      validateRequest(next, done, (authRequest) => {
        const authHeader = authRequest.headers.get('Authorization');
        expect(authHeader).toBe('Bearer abc');
      });

      interceptor.intercept(request, next).subscribe(() => {});

      expect(mockTokenProvider.getContextToken).toHaveBeenCalledWith(
        jasmine.objectContaining(expectedTokenArgs)
      );
    });

  it('should not add the default permission scope if it is not injected',
    (done) => {
      const interceptor = TestBed.get(SkyAuthInterceptor);
      const request = createRequest(true);

      validateRequest(next, done, (authRequest) => {
        const authHeader = authRequest.headers.get('Authorization');
        expect(authHeader).toBe('Bearer abc');
      });

      interceptor.intercept(request, next).subscribe(() => {});

      const expectedTokenArgs: SkyAuthTokenContextArgs = {};

      expect(mockTokenProvider.getContextToken).toHaveBeenCalledWith(
        jasmine.objectContaining(expectedTokenArgs)
      );
    });

  it('should not add the default permission scope if it is injected and a scope is passed in',
    (done) => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: SKY_AUTH_DEFAULT_PERMISSION_SCOPE,
            useValue: 'default-permission-scope'
          }
        ]
      });

      const interceptor = TestBed.get(SkyAuthInterceptor);
      const specifiedPermissionScope = 'specified-permission-scope';
      const request = createRequest(true, undefined, specifiedPermissionScope);

      validateRequest(next, done, (authRequest) => {
        const authHeader = authRequest.headers.get('Authorization');
        expect(authHeader).toBe('Bearer abc');
      });

      const expectedTokenArgs: SkyAuthTokenContextArgs = {};
      expectedTokenArgs.permissionScope = specifiedPermissionScope;

      interceptor.intercept(request, next).subscribe(() => {});

      expect(mockTokenProvider.getContextToken).toHaveBeenCalledWith(
        jasmine.objectContaining(expectedTokenArgs)
      );
    });
});
