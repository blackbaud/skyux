import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

import {
  SKY_AUTH_PARAM_AUTH,
  SKY_AUTH_PARAM_PERMISSION_SCOPE,
} from './auth-interceptor-params';

/**
 * The standard options expected by Angular's HttpClient methods along with
 * additional options for making requests to services protected by Blackbaud ID.
 * @param options
 */
export function skyAuthHttpOptions(options?: {
  body?: any;
  context?: HttpContext;
  headers?: HttpHeaders;
  observe?: 'body' | 'events' | 'response';
  params?: HttpParams;
  reportProgress?: boolean;
  permissionScope?: string;
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
  withCredentials?: boolean;
}): any {
  options = options || {};
  options.params = options.params || new HttpParams();

  options.params = options.params.set(SKY_AUTH_PARAM_AUTH, 'true');

  if (options.permissionScope) {
    options.params = options.params.set(
      SKY_AUTH_PARAM_PERMISSION_SCOPE,
      options.permissionScope,
    );
  }

  delete options.permissionScope;

  return options;
}

/**
 * The standard options expected by Angular's HttpClient methods along with
 * additional options for making requests to services protected by Blackbaud ID and
 * ensures that the subsequent call to `HttpClient` returns the generic type passed
 * to it by enforcing a `responseType` of `'json'`.
 * @param options
 */
export function skyAuthHttpJsonOptions(options?: {
  body?: any;
  context?: HttpContext;
  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams;
  reportProgress?: boolean;
  permissionScope?: string;
  responseType?: 'json';
  withCredentials?: boolean;
}): {
  body?: any;
  context?: HttpContext;
  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams;
  reportProgress?: boolean;
  permissionScope?: string;
  responseType?: 'json';
  withCredentials?: boolean;
} {
  options = options || {};

  options.observe = 'body';
  options.responseType = 'json';

  return skyAuthHttpOptions(options);
}
