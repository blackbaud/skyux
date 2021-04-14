import {
  Injectable,
  Optional
} from '@angular/core';

import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';

import {
  BBAuthClientFactory
} from '@skyux/auth-client-factory';

import {
  SkyAppConfig,
  SkyAppRuntimeConfigParamsProvider
} from '@skyux/config';

import {
  from,
  Observable
} from 'rxjs';

import {
  switchMap
} from 'rxjs/operators';

import {
  SKY_AUTH_PARAM_AUTH
} from './auth-interceptor-params';

@Injectable()
export class SkyNoAuthInterceptor implements HttpInterceptor {

  constructor(
    @Optional() private config?: SkyAppConfig,
    @Optional() private paramsProvider?: SkyAppRuntimeConfigParamsProvider
  ) {}

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const noAuth = !request.params ||
      !request.params.get(SKY_AUTH_PARAM_AUTH) ||
      request.params.get(SKY_AUTH_PARAM_AUTH) === 'false';

    if (noAuth) {
      return from(BBAuthClientFactory.BBAuth.getUrl(request.url))
        .pipe(
          switchMap((url) => {
            const runtimeParams = this.config?.runtime.params || this.paramsProvider.params;

            const newRequest = request.clone({
              url: runtimeParams.getUrl(url)
            });

            return next.handle(newRequest);
          })
        );
    } else {
      return next.handle(request);
    }
  }
}
