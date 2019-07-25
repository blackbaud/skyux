//#region imports

import {
  HttpHandler,
  HttpParams,
  HttpRequest
} from '@angular/common/http';

import {
  TestBed
} from '@angular/core/testing';

import {
  Observable
} from 'rxjs/Observable';

import 'rxjs/add/observable/of';

import {
  SkyAppConfig,
  SkyAppRuntimeConfigParams
} from '@skyux/config';

import {
  SkyAuthTokenContextArgs,
  SkyAuthTokenProvider
} from '../auth-http';

import {
  SkyAuthInterceptor
} from './auth-interceptor';

import {
  SKY_AUTH_DEFAULT_PERMISSION_SCOPE
} from './auth-interceptor-default-permission-scope';

import {
  SKY_AUTH_PARAM_AUTH,
  SKY_AUTH_PARAM_PERMISSION_SCOPE
} from './auth-interceptor-params';

//#endregion

type Spy<T> = { [Method in keyof T]: jasmine.Spy; };

describe('Auth interceptor', () => {
  let mockTokenProvider: Spy<SkyAuthTokenProvider>;
  let mockRuntimeConfigParameters: Spy<SkyAppRuntimeConfigParams>;
  let config: SkyAppConfig;
  let next: Spy<HttpHandler>;

  function createRequest(
    isSkyAuth?: boolean,
    permissionScope?: string
  ): HttpRequest<any> {
    let params: HttpParams = new HttpParams();

    if (isSkyAuth) {
      params = params.set(SKY_AUTH_PARAM_AUTH, 'true');
    }

    if (permissionScope) {
      params = params.set(SKY_AUTH_PARAM_PERMISSION_SCOPE, permissionScope);
    }

    const request = new HttpRequest(
      'GET',
      'https://example.com/get/',
      {
        params: params
      }
    );

    return request;
  }

  function validateAuthRequest(
    done: DoneFn,
    cb: (authRequest: HttpRequest<any>) => void
  ): void {
    next.handle.and.callFake((authRequest: HttpRequest<any>) => {
      cb(authRequest);
      done();
      return Observable.of('');
    });
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
      return expectedUrl || 'https://example.com/get/';
    });

    const request = createRequest(true, permissionScope);

    const interceptor: SkyAuthInterceptor = TestBed.get(SkyAuthInterceptor);
    interceptor.intercept(request, next);

    validateAuthRequest(done, (authRequest) => {
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
      ['getContextToken']
    );

    mockTokenProvider.getContextToken.and.returnValue(Promise.resolve('abc'));

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

    validateAuthRequest(done, (authRequest) => {
      expect(authRequest.headers.get('Authorization')).toBe('Bearer abc');
    });

    interceptor.intercept(request, next).subscribe(() => {});
  });

  it('should add a permission scope to the token request if specified', (done) => {
    validateContext(undefined, undefined, '123', 'https://example.com/get/', done);
  });

  it('should apply the appropriate environment context', (done) => {
    validateContext('abc', undefined, undefined, 'https://example.com/get/?envid=abc', done);
  });

  it('should apply the appropriate legal entity context', (done) => {
    validateContext(undefined, 'abc', undefined, 'https://example.com/get/?leid=abc', done);
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

      validateAuthRequest(done, (authRequest) => {
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

      validateAuthRequest(done, (authRequest) => {
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
      const request = createRequest(true, specifiedPermissionScope);

      validateAuthRequest(done, (authRequest) => {
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
