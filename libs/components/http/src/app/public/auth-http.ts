import {
  Injectable
} from '@angular/core';

import {
  ConnectionBackend,
  Headers,
  Http,
  Request,
  RequestOptions,
  RequestOptionsArgs,
  Response
} from '@angular/http';

import {
  BBAuthGetTokenArgs
} from '@blackbaud/auth-client';

import {
  SkyAppConfig
} from '@blackbaud/skyux-builder/runtime';

import {
  Observable
} from 'rxjs/Observable';

import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';

import {
  SkyAuthTokenProvider
} from './auth-token-provider';

/**
 * Makes authenticated web requests to Blackbaud web services using a BBID token.
 */
@Injectable()
export class SkyAuthHttp extends Http {
  private permissionScope: string;

  constructor(
    private backend: ConnectionBackend,
    private defaultOptions: RequestOptions,
    private authTokenProvider: SkyAuthTokenProvider,
    private skyAppConfig: SkyAppConfig
  ) {
    super(backend, defaultOptions);
  }

  /**
   * Adds the specified permission scope to the token that can then be passed to the
   * backend web service.
   * @param permissionScope The permission scope to include.
   */
  public withScope(permissionScope: string): SkyAuthHttp {
    // There was no clean way to allow permission scope to be specified with all the various
    // convenience methods such as get(), post(), etc. that the base Http class provides,
    // so this chainable method just creates a new instance of SkyAuthHttp with a permissionScope
    // property set.  When chained, the end call would look something like this:
    // http.withScope('abc').get(url);

    const http = new SkyAuthHttp(
      this.backend,
      this.defaultOptions,
      this.authTokenProvider,
      this.skyAppConfig
    );

    http.permissionScope = permissionScope;

    return http;
  }

  /**
   * Makes an authenticated request to a Blackbaud service.
   * @param url The URL to request.
   * @param options The request options.
   */
  public request(
    url: string | Request,
    options?: RequestOptionsArgs
  ): Observable<Response> {
    const tokenArgs: BBAuthGetTokenArgs = {};
    const leId = this.getLeId();
    const envId = this.getEnvId();

    // See if this call was chained to withScope(), and if so,
    // provide it when retrieving a token.
    if (this.permissionScope) {
      tokenArgs.permissionScope = this.permissionScope;
    }

    if (envId) {
      tokenArgs.envId = envId;
    }

    if (leId) {
      tokenArgs.leId = leId;
    }

    return Observable.fromPromise(this.authTokenProvider.getToken(tokenArgs))
      .flatMap((token: string) => {
        let authOptions: Request | RequestOptionsArgs;

        if (url instanceof Request) {
          // If the user calls get(), post(), or any of the other convenience
          // methods supplied by the Http base class, Angular will have converted
          // the url parameter to a Request object and the options parameter will
          // be undefined.
          authOptions = url;
          url.url = this.skyAppConfig.runtime.params.getUrl(url.url);
        } else {
          // The url parameter can be a string in cases where reuqest() is called
          // directly by the consumer.  Handle that case by adding the header to the
          // options parameter.
          authOptions = options || new RequestOptions();
          url = this.skyAppConfig.runtime.params.getUrl(url);
        }

        authOptions.headers = authOptions.headers || new Headers();

        authOptions.headers.set('Authorization', 'Bearer ' + token);

        return super.request(url, authOptions);
      });
  }

  private getEnvId(): string {
    return this.skyAppConfig.runtime.params.get('envid');
  }

  private getLeId(): string {
    return this.skyAppConfig.runtime.params.get('leid');
  }
}
