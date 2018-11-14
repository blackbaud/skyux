import {
  HttpHeaders,
  HttpParams
} from '@angular/common/http';

import {
  HttpObserve
} from '@angular/common/http/src/client';

import {
  SKY_AUTH_PARAM_AUTH,
  SKY_AUTH_PARAM_PERMISSION_SCOPE
} from './auth-interceptor-params';

/**
 * Provides the standard options expected by Angular's HttpClient methods along with
 * additional options for making requests to services protected by Blackbaud ID.
 * @param options
 */
export function skyAuthHttpOptions(options?: {
  body?: any,
  headers?: HttpHeaders,
  observe?: HttpObserve,
  params?: HttpParams,
  reportProgress?: boolean,
  permissionScope?: string,
  responseType?: 'arraybuffer'|'blob'|'json'|'text',
  withCredentials?: boolean
}): any {
  options = options || {};
  options.params = options.params || new HttpParams();

  options.params = options.params.set(SKY_AUTH_PARAM_AUTH, 'true');

  if (options.permissionScope) {
    options.params = options.params.set(SKY_AUTH_PARAM_PERMISSION_SCOPE, options.permissionScope);
  }

  delete options.permissionScope;

  return options;
}
