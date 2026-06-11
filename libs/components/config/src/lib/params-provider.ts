import { Injectable, Optional } from '@angular/core';

import { SkyAppConfigParams } from './app-config-params';
import { SkyAppRuntimeConfigParams } from './params';

/**
 * Provides methods to interact with runtime config query parameters.
 * @deprecated Use `SkyAppConfig.runtime.params` instead.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyAppRuntimeConfigParamsProvider {
  public get params(): SkyAppRuntimeConfigParams {
    return this.#_params;
  }

  #_params: SkyAppRuntimeConfigParams;

  // eslint-disable-next-line @angular-eslint/prefer-inject -- constructor injection is required to maintain the public API for consumers who may instantiate this service directly (e.g. `new SkyAppRuntimeConfigParamsProvider(...)`)
  constructor(@Optional() configParams?: SkyAppConfigParams) {
    this.#_params = new SkyAppRuntimeConfigParams(
      window.location.href,
      configParams?.params || {},
    );
  }
}
