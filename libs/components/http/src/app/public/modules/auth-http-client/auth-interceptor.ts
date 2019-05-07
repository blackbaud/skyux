//#region imports

import {
  Injectable
} from '@angular/core';

import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';

import {
  Observable
} from 'rxjs/Observable';

import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/switchMap';

import {
  SkyAppConfig
} from '@skyux/config';

import {
  SkyAuthTokenContextArgs,
  SkyAuthTokenProvider
} from '../auth-http';

import {
  SKY_AUTH_PARAM_AUTH,
  SKY_AUTH_PARAM_PERMISSION_SCOPE
} from './auth-interceptor-params';

//#endregion

function removeSkyParams(request: HttpRequest<any>): HttpRequest<any> {
  // The if statement here is just a sanity check; it appears that by the time
  // this interceptor is called, the params property is always defined, even if
  // it's not provided when the HTTP request is created.
  /* istanbul ignore else */
  if (request.params) {
    request = request.clone(
      {
        params: request.params
          .delete(SKY_AUTH_PARAM_AUTH)
          .delete(SKY_AUTH_PARAM_PERMISSION_SCOPE)
      }
    );
  }

  return request;
}

@Injectable()
export class SkyAuthInterceptor implements HttpInterceptor {
  constructor(
    private tokenProvider: SkyAuthTokenProvider,
    private config: SkyAppConfig
  ) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let auth: boolean;
    let permissionScope: string;

    const params = request.params;

    if (
      params &&
      (
        params.has(SKY_AUTH_PARAM_AUTH) ||
        params.has(SKY_AUTH_PARAM_PERMISSION_SCOPE)
      )
    ) {
      auth = params.get(SKY_AUTH_PARAM_AUTH) === 'true';
      permissionScope = params.get(SKY_AUTH_PARAM_PERMISSION_SCOPE);

      request = removeSkyParams(request);
    }

    if (auth) {
      const tokenContextArgs: SkyAuthTokenContextArgs = {};

      if (permissionScope) {
        tokenContextArgs.permissionScope = permissionScope;
      }

      return Observable
        .fromPromise(this.tokenProvider.getContextToken(tokenContextArgs))
        .switchMap((token) => {
          let authRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            },
            url: this.config.runtime.params.getUrl(request.url)
          });

          return next.handle(authRequest);
        });
    }

    return next.handle(request);
  }

}
