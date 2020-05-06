import {
  HttpHandler,
  HttpParams,
  HttpRequest
} from '@angular/common/http';

import {
  SKY_AUTH_PARAM_AUTH,
  SKY_AUTH_PARAM_PERMISSION_SCOPE
} from '../auth-interceptor-params';

import {
  Observable
} from 'rxjs/Observable';

export const EXAMPLE_URL = 'https://example.com/get/';

export type Spy<T> = { [Method in keyof T]: jasmine.Spy; };

export function createRequest(isSkyAuth?: boolean, url?: string, permissionScope?: string) {
  let params: HttpParams;

  if (isSkyAuth) {
    params = params || new HttpParams();
    params = params.set(SKY_AUTH_PARAM_AUTH, 'true');
  }

  if (permissionScope) {
    params = params || new HttpParams();
    params = params.set(SKY_AUTH_PARAM_PERMISSION_SCOPE, permissionScope);
  }

  let request: HttpRequest<any>;

  if (params) {
    request = new HttpRequest(
      'GET',
      url || EXAMPLE_URL,
      {
        params
      }
    );
  } else {
    request = new HttpRequest(
      'GET',
      url || EXAMPLE_URL
    );
  }

  return request;
}

export function validateRequest(
  next: Spy<HttpHandler>,
  done: DoneFn,
  cb: (authRequest: HttpRequest<any>) => void
): void {
  next.handle.and.callFake((authRequest: HttpRequest<any>) => {
    cb(authRequest);
    done();
    return Observable.of('');
  });
}

export function createAppConfig(envId?: string, leId?: string, getUrlResult?: string) {
  return {
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
        getUrl: (url: string) => getUrlResult || url || EXAMPLE_URL
      }
    } as any,
    skyux: {}
  };
}
