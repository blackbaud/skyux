import { HttpParams, HttpUrlEncodingCodec } from '@angular/common/http';

import { SkyuxConfigParams } from './config-params';
import { SkyConfigGetLinkUrlOptions } from './types/get-link-url-options';
import { SkyConfigQueryParams } from './types/query-params';

/**
 * Override Angular's default encoder because it excludes certain characters.
 * @see https://github.com/angular/angular/blob/cb31dbc75ca4141d61cec3ba6e60505198208a0a/packages/common/http/src/params.ts#L96-L111
 */
class UrlEncoder extends HttpUrlEncodingCodec {
  public override encodeKey(key: string | number | boolean): string {
    return encodeURIComponent(key);
  }

  public override encodeValue(key: string | number | boolean): string {
    return encodeURIComponent(key);
  }
}

/**
 * Given a "url" (could be just querystring, or fully qualified),
 * Returns the extracted HttpParams.
 */
function getUrlSearchParams(url: string): HttpParams {
  let qs = '';

  if (url.indexOf('?') > -1) {
    qs = url.split('?')[1];
    qs = qs.split('#')[0];
  }

  return new HttpParams({
    encoder: new UrlEncoder(),
    fromString: qs,
  });
}

export class SkyAppRuntimeConfigParams {
  #params: Record<string, string> = {};

  #defaultParamValues: Record<string, string> = {};

  #requiredParams: string[] = [];

  #encodedParams: string[] = [];

  #excludeFromLinksParams = new Set<string>();
  #excludeFromRequestsParams = new Set<string>();

  constructor(url: string, configParams: SkyuxConfigParams) {
    const allowed: string[] = [];

    for (const paramName of Object.keys(configParams)) {
      const configParam = configParams[paramName];

      // The config param could be present but be set to false/undefined indicating
      // an override of the default parameter.
      if (configParam) {
        allowed.push(paramName);

        // A boolean value may be present to simply indicate that a parameter is allowed.
        // If the type is object, look for additional config properties.
        if (typeof configParam === 'object') {
          const paramValue = configParam.value;

          if (configParam.required) {
            this.#requiredParams.push(paramName);
          }

          if (paramValue) {
            this.#params[paramName] = paramValue;
            this.#defaultParamValues[paramName] = paramValue;
          }

          if (configParam.excludeFromLinks) {
            this.#excludeFromLinksParams.add(paramName);
          }

          if (configParam.excludeFromRequests) {
            this.#excludeFromRequestsParams.add(paramName);
          }
        }
      }
    }

    const httpParams = getUrlSearchParams(url);

    // Get uppercase keys.
    const allowedKeysUC = allowed.map((key) => key.toUpperCase());
    const urlSearchParamKeys = Array.from(httpParams.keys());

    // Filter to allowed params and override default values.
    urlSearchParamKeys.forEach((givenKey) => {
      const givenKeyUC = givenKey.toUpperCase();
      allowedKeysUC.forEach((allowedKeyUC, index) => {
        if (givenKeyUC === allowedKeyUC) {
          const param = httpParams.get(givenKey);

          if (param) {
            this.#params[allowed[index]] = param;
            this.#encodedParams.push(givenKey);
          }
        }
      });
    });
  }

  /**
   * Does the key exist
   */
  public has(key: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.#params, key);
  }

  /**
   * Are all the required params defined?
   */
  public hasAllRequiredParams(): boolean {
    if (this.#requiredParams.length === 0) {
      return true;
    }

    return this.#requiredParams.every((param: string) => {
      return this.#params[param] !== undefined;
    });
  }

  /**
   * Returns a flag indicating whether a parameter is required.
   */
  public isRequired(key: string): boolean {
    return this.#requiredParams.indexOf(key) >= 0;
  }

  /**
   * Returns the decoded value of the requested param.
   * @param key The parameter's key.
   */
  public get(key: string): string | undefined {
    if (this.has(key)) {
      return this.#params[key];
    }

    return;
  }

  /**
   * Returns the params object.
   * @param excludeDefaults Exclude params that have default values
   */
  public getAll(excludeDefaults?: boolean): Record<string, string> {
    const filteredParams: Record<string, string> = {};

    this.getAllKeys().forEach((key) => {
      if (
        !excludeDefaults ||
        this.#params[key] !== this.#defaultParamValues[key]
      ) {
        filteredParams[key] = this.#params[key];
      }
    });

    return filteredParams;
  }

  /**
   * Returns all keys for current params.
   */
  public getAllKeys(): string[] {
    return Object.keys(this.#params);
  }

  /**
   * Adds the current params to the supplied URL.
   */
  public getUrl(url: string): string {
    return this.#buildUrlWithParams(url, this.#excludeFromRequestsParams);
  }

  /**
   * Adds the current params to the supplied link URL.
   * @param url The url to update.
   * @param options Options used to create link URLs.
   */
  public getLinkUrl(url: string, options?: SkyConfigGetLinkUrlOptions): string {
    return this.#buildUrlWithParams(
      url,
      new Set([
        ...this.#excludeFromRequestsParams,
        ...this.#excludeFromLinksParams,
      ]),
      options?.queryParams,
    );
  }

  #buildUrlWithParams(
    url: string,
    excludeParams: Set<string>,
    queryParams?: SkyConfigQueryParams,
  ): string {
    const urlParams = getUrlSearchParams(url);

    // Determine if the url params need to be modified.
    const urlParamsRequireModification = urlParams
      .keys()
      .some((key) => excludeParams.has(key) || queryParams?.[key]);

    const [beforeFragment, fragment] = url.split('#', 2);

    const root = urlParamsRequireModification
      ? beforeFragment.split('?')[0]
      : beforeFragment;

    let unifiedParams = urlParamsRequireModification
      ? urlParams
      : getUrlSearchParams('');

    // Remove excluded params.
    if (urlParamsRequireModification) {
      for (const paramName of excludeParams.keys()) {
        unifiedParams = unifiedParams.delete(paramName);
      }
    }

    // Add provided parameters to the URL.
    if (queryParams) {
      for (const [paramName, decodedValue] of Object.entries(queryParams)) {
        if (decodedValue !== undefined) {
          unifiedParams = unifiedParams.set(paramName, decodedValue);
        }
      }
    }

    // Respect pre-existing params which already have values.
    for (const key of this.getAllKeys()) {
      if (
        !excludeParams.has(key) &&
        !urlParams.has(key) &&
        !unifiedParams.has(key)
      ) {
        const decodedValue = this.get(key);
        if (decodedValue) {
          unifiedParams = unifiedParams.append(key, decodedValue);
        }
      }
    }

    // Combine all requested parameters and their values, e.g. 'a=b'.
    const joinedParams = unifiedParams.toString();
    const delimiter = root.includes('?') ? '&' : '?';

    // Build and return the final URL.
    return (
      root +
      (joinedParams.length === 0 ? '' : `${delimiter}${joinedParams}`) +
      (fragment ? `#${fragment}` : '')
    );
  }
}
