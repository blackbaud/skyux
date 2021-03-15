import {
  Injectable,
  Optional
} from '@angular/core';

import {
  SkyAppConfigParams
} from './app-config-params';

import {
  SkyAppParamsConfig
} from './params-config';

import {
  SkyAppRuntimeConfigParams
} from './params';

/**
 * Provides methods to interact with runtime config query parameters.
 */
@Injectable({
  providedIn: 'root'
})
export class SkyAppRuntimeConfigParamsProvider {

  public get params(): SkyAppRuntimeConfigParams {
    return this._params;
  }

  private _params: SkyAppRuntimeConfigParams;

  constructor(
    @Optional() paramsConfig?: SkyAppParamsConfig,
    @Optional() configParams?: SkyAppConfigParams
  ) {
    this._params = new SkyAppRuntimeConfigParams(
      window.location.href,
      configParams?.params || paramsConfig?.params || {}
    );
  }

}
