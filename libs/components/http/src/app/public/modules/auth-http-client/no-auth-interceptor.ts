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
  SkyAppConfig
} from '@skyux/config';

import {
  Observable
} from 'rxjs/Observable';

import {
  SKY_AUTH_PARAM_AUTH
} from './auth-interceptor-params';

import {
  BBAuthClientFactory
} from '@skyux/auth-client-factory';

import 'rxjs/add/observable/fromPromise';

import 'rxjs/add/operator/switchMap';

@Injectable()
export class SkyNoAuthInterceptor implements HttpInterceptor {

  constructor(private config: SkyAppConfig) {}

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const noAuth = !request.params ||
      !request.params.get(SKY_AUTH_PARAM_AUTH) ||
      request.params.get(SKY_AUTH_PARAM_AUTH) === 'false';

    if (noAuth) {
      return Observable
        .fromPromise(BBAuthClientFactory.BBAuth.getUrl(request.url))
        .switchMap((url) => {
          const newRequest = request.clone({
            url: this.config.runtime.params.getUrl(url)
          });
          return next.handle(newRequest);
        });
    } else {
      return next.handle(request);
    }
  }
}
