//#region imports

import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';

import {
  Inject,
  Injectable,
  Optional
} from '@angular/core';

import {
  from as observableFrom,
  Observable
} from 'rxjs';

import {
  switchMap
} from 'rxjs/operators';

import {
  BBAuthClientFactory
} from '@skyux/auth-client-factory';

import {
  SkyAppConfig,
  SkyAppRuntimeConfigParamsProvider
} from '@skyux/config';

import {
  SKY_AUTH_DEFAULT_PERMISSION_SCOPE
} from './auth-interceptor-default-permission-scope';

import {
  SKY_AUTH_PARAM_AUTH,
  SKY_AUTH_PARAM_PERMISSION_SCOPE
} from './auth-interceptor-params';

import {
  SkyAuthTokenContextArgs
} from './auth-token-context-args';

import {
  SkyAuthTokenProvider
} from './auth-token-provider';

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
    @Optional() private config: SkyAppConfig,
    @Inject(SKY_AUTH_DEFAULT_PERMISSION_SCOPE) @Optional() private defaultPermissionScope?: string,
    @Optional() private paramsProvider?: SkyAppRuntimeConfigParamsProvider
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
      permissionScope = permissionScope || this.defaultPermissionScope;

      const tokenContextArgs: SkyAuthTokenContextArgs = {};

      if (permissionScope) {
        tokenContextArgs.permissionScope = permissionScope;
      }

      return observableFrom(
        this.tokenProvider.getContextToken(tokenContextArgs)
      ).pipe(
        switchMap((token) => {
          const decodedToken = this.tokenProvider.decodeToken(token);
          return observableFrom(
            BBAuthClientFactory.BBAuth.getUrl(request.url, {
              zone: decodedToken['1bb.zone']
            })
          ).pipe(
            switchMap((url) => {
              const runtimeParams = this.config?.runtime.params || this.paramsProvider.params;

              const authRequest = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`
                },
                url: runtimeParams.getUrl(url)
              });
              return next.handle(authRequest);
            })
          );
        })
      );
    }

    return next.handle(request);
  }

}
