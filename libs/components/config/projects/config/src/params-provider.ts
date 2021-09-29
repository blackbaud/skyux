import {
  Injectable,
  Optional
} from '@angular/core';

import {
  SkyAppConfigParams
} from './app-config-params';

import {
  SkyAppRuntimeConfigParams
} from './params';

/**
 * Provides methods to interact with runtime config query parameters.
 * @deprecated Use `SkyAppConfig.runtime.params` instead.
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
    @Optional() configParams?: SkyAppConfigParams
  ) {
    this._params = new SkyAppRuntimeConfigParams(
      window.location.href,
      configParams?.params || {}
    );
  }

}
