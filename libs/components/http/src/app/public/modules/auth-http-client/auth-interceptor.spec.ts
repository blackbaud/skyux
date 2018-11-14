//#region imports

import {
  HttpEventType,
  HttpHandler,
  HttpParams,
  HttpRequest,
  HttpSentEvent
} from '@angular/common/http';

import {
  Observable
} from 'rxjs/Observable';

import 'rxjs/add/observable/of';

import {
  SkyAuthInterceptor
} from './auth-interceptor';

import {
  SKY_AUTH_PARAM_AUTH,
  SKY_AUTH_PARAM_PERMISSION_SCOPE
} from './auth-interceptor-params';

//#endregion

class MockHttpHandler extends HttpHandler {
  public handle() {
    return Observable.of({
      type: HttpEventType.Sent
    } as HttpSentEvent);
  }
}

describe('Auth interceptor', () => {
  let mockTokenProvider = {
    getToken: () => Promise.resolve('abc')
  };

  function createInteceptor(envId?: string, leId?: string, url?: string) {
    return new SkyAuthInterceptor(
      mockTokenProvider,
      {
        runtime: {
          params: {
            get: (name: string) => {
              switch (name) {
                case 'envid':
                  return envId;
                case 'leid':
                  return leId;
                default:
                  return undefined;
              }
            },
            getUrl: () => url || 'https://example.com/get/'
          }
        } as any,
        skyux: {}
      });
  }

  function createRequest(params?: HttpParams) {
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
    next: MockHttpHandler,
    done: DoneFn,
    cb: (authRequest: HttpRequest<any>) => void
  ) {
    spyOn(next, 'handle').and.callFake(
      (authRequest: HttpRequest<any>) => {
        cb(authRequest);
        done();
        return Observable.of('');
      }
    );
  }

  function validateContext(
    envId: string,
    leId: string,
    permissionScope: string,
    expectedUrl: string,
    done: DoneFn
  ) {
    const interceptor = createInteceptor(envId, leId, expectedUrl);

    let params = new HttpParams().set(SKY_AUTH_PARAM_AUTH, 'true');

    if (permissionScope) {
      params = params.set(SKY_AUTH_PARAM_PERMISSION_SCOPE, permissionScope);
    }

    const request = createRequest(params);

    const next = new MockHttpHandler();

    const getTokenSpy = spyOn(mockTokenProvider, 'getToken').and.callThrough();

    interceptor.intercept(request, next);

    validateAuthRequest(next, done, (authRequest) => {
      expect(authRequest.url).toBe(expectedUrl);
    });

    interceptor.intercept(request, next).subscribe(() => {});

    const expectedTokenArgs: any = {};

    if (envId) {
      expectedTokenArgs.envId = envId;
    }

    if (leId) {
      expectedTokenArgs.leId = leId;
    }

    expect(getTokenSpy).toHaveBeenCalledWith(
      jasmine.objectContaining(expectedTokenArgs)
    );
  }

  it('should pass through the existing request when not an auth request', () => {
    const interceptor = createInteceptor();

    const request = createRequest();

    const next = new MockHttpHandler();

    const handleSpy = spyOn(next, 'handle');

    interceptor.intercept(request, next);

    expect(handleSpy).toHaveBeenCalledWith(request);
  });

  it('should add a token to the request if the sky_auth parameter is set', (done) => {
    const interceptor = createInteceptor();

    const request = createRequest(
      new HttpParams()
        .set(SKY_AUTH_PARAM_AUTH, 'true')
    );

    const next = new MockHttpHandler();

    validateAuthRequest(next, done, (authRequest) => {
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

});
