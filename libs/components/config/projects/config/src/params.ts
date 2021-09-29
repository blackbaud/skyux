import {
  HttpParams
} from '@angular/common/http';

import {
  SkyuxConfigParams
} from './config-params';

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
    fromString: qs
  });
}

export class SkyAppRuntimeConfigParams {

  private params: { [key: string]: string } = {};

  private defaultParamValues: { [key: string]: string } = {};

  private requiredParams: string[] = [];

  private encodedParams: string[] = [];

  private excludeFromRequestsParams: string[] = [];

  constructor(
    url: string,
    configParams: SkyuxConfigParams
  ) {
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
            this.requiredParams.push(paramName);
          }

          if (paramValue) {
            this.params[paramName] = paramValue;
            this.defaultParamValues[paramName] = paramValue;
          }

          if (configParam.excludeFromRequests) {
            this.excludeFromRequestsParams.push(paramName);
          }
        }
      }
    }

    const httpParams = getUrlSearchParams(url);

    // Get uppercase keys.
    const allowedKeysUC = allowed.map(key => key.toUpperCase());
    const urlSearchParamKeys = Array.from(httpParams.keys());

    // Filter to allowed params and override default values.
    urlSearchParamKeys.forEach(givenKey => {
      const givenKeyUC = givenKey.toUpperCase();
      allowedKeysUC.forEach((allowedKeyUC, index) => {
        if (givenKeyUC === allowedKeyUC) {
          // To avoid breaking changes, we must encode the parameter value since
          // this was the default behavior of the previously used UrlSearchParams utility.
          // TODO: Remove encoding in favor of HttpParams' default behavior.
          const value = encodeURIComponent(httpParams.get(givenKey));

          this.params[allowed[index]] = value;
          this.encodedParams.push(givenKey);
        }
      });
    });
  }

  /**
   * Does the key exist
   */
  public has(key: string): boolean {
    return this.params && this.params.hasOwnProperty(key);
  }

  /**
   * Are all the required params defined?
   */
  public hasAllRequiredParams(): boolean {
    if (this.requiredParams.length === 0) {
      return true;
    }

    return this.requiredParams.every((param: string) => {
      return this.params[param] !== undefined;
    });
  }

  /**
   * Returns a flag indicating whether a parameter is required.
   */
  public isRequired(key: string): boolean {
    return this.requiredParams.indexOf(key) >= 0;
  }

  /**
   * Returns the decoded value of the requested param.
   * @param key The parameter's key.
   */
  public get(key: string): string {
    if (this.has(key)) {
      return decodeURIComponent(this.params[key]);
    }
  }

  /**
   * Returns the params object.
   * @param excludeDefaults Exclude params that have default values
   */
  public getAll(excludeDefaults?: boolean): Object {
    const filteredParams: { [key: string]: string} = {};

    this.getAllKeys().forEach(key => {
      if (!excludeDefaults || this.params[key] !== this.defaultParamValues[key]) {
        filteredParams[key] = this.params[key];
      }
    });

    return filteredParams;
  }

  /**
   * Returns all keys for current params.
   */
  public getAllKeys(): string[] {
    return Object.keys(this.params);
  }

  /**
   * Adds the current params to the supplied url.
   */
  public getUrl(url: string): string {
    const httpParams = getUrlSearchParams(url);
    const delimiter = url.indexOf('?') === -1 ? '?' : '&';
    const joined: string[] = [];

    this.getAllKeys().forEach(key => {
      if (
        this.excludeFromRequestsParams.indexOf(key) === -1 &&
        !httpParams.has(key)
      ) {
        joined.push(`${key}=${encodeURIComponent(this.get(key))}`);
      }
    });

    return joined.length === 0 ? url : `${url}${delimiter}${joined.join('&')}`;
  }
}
