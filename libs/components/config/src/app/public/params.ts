import {
  URLSearchParams
} from '@angular/http';

import {
  SkyuxConfigParams
} from './config-params';

/**
 * Given a "url" (could be just querystring, or fully qualified),
 * Returns the extracted URLSearchParams.
 * @param {string} url
 * @return {URLSearchParams} urlSearchParams
 */
function getUrlSearchParams(url: string): URLSearchParams {

  let qs = '';

  if (url.indexOf('?') > -1) {
    qs = url.split('?')[1];
    qs = qs.split('#')[0];
  }

  return new URLSearchParams(qs);
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
    let allowed: string[];

    // The default params value in Builder's skyuxconfig.json has been changed
    // from an array to an object to support more metadata about each parameter,
    // including the parameter's default value and possible future properties
    // like required. Check for an array first to maintain backwards compatibility
    // with the previous default value and any consumers who may be overriding the
    // value until we release builder 2.0.
    if (Array.isArray(configParams)) {
      allowed = configParams;
    } else {
      allowed = [];

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
    }

    const urlSearchParams = getUrlSearchParams(url);

    // Get uppercase keys.
    const allowedKeysUC = allowed.map(key => key.toUpperCase());
    const urlSearchParamKeys = Array.from(urlSearchParams.paramsMap.keys());

    // Filter to allowed params and override default values.
    urlSearchParamKeys.forEach(givenKey => {
      const givenKeyUC = givenKey.toUpperCase();
      allowedKeysUC.forEach((allowedKeyUC, index) => {
        if (givenKeyUC === allowedKeyUC) {
          this.params[allowed[index]] = urlSearchParams.get(givenKey);
          this.encodedParams.push(givenKey);
        }
      });
    });
  }

  /**
   * Does the key exist
   * @param {string} key
   * @returns {boolean}
   */
  public has(key: string): boolean {
    return this.params && this.params.hasOwnProperty(key);
  }

  /**
   * Are all the required params defined?.
   * @name hasAllRequiredParams
   * @returns {array}
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
   * @param key
   */
  public isRequired(key: string): boolean {
    return this.requiredParams.indexOf(key) >= 0;
  }

  /**
   * Returns the value of the requested param.
   * @name get
   * @param {string} key The parameter's key.
   * @param {boolean} urlDecode A flag indicating whether the value should be URL-decoded.
   * Specify true when you anticipate the value of the parameter coming from the page's URL.
   * @returns {string}
   */
  public get(key: string, urlDecode?: boolean): string {
    if (this.has(key)) {
      let val = this.params[key];

      // This should be changed to always decode encoded params in skyux-builder 2.0.
      if (urlDecode && this.encodedParams.indexOf(key) >= 0) {
        val = decodeURIComponent(val);
      }

      return val;
    }
  }

  /**
   * Returns the params object
   * @name getAll
   * @param {boolean} excludeDefaults Exclude params that have default values
   * @returns {Object}
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
   * @name getAllKeys
   * @returns {array}
   */
  public getAllKeys(): string[] {
    return Object.keys(this.params);
  }

  /**
   * Adds the current params to the supplied url.
   * @name getUrl
   * @param {string} url
   * @returns {string} url
   */
  public getUrl(url: string): string {
    const urlSearchParams = getUrlSearchParams(url);
    const delimiter = url.indexOf('?') === -1 ? '?' : '&';
    const joined: string[] = [];

    this.getAllKeys().forEach(key => {
      if (
        this.excludeFromRequestsParams.indexOf(key) === -1 &&
        !urlSearchParams.has(key)
      ) {
        joined.push(`${key}=${encodeURIComponent(this.get(key, true))}`);
      }
    });

    return joined.length === 0 ? url : `${url}${delimiter}${joined.join('&')}`;
  }
}
