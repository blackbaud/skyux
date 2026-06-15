import { Injectable, Optional } from '@angular/core';

import { SkyuxConfigParams } from './config-params';
import { SkyAppParamsConfigArgs } from './params-config-args';

const DEFAULTS = {
  params: {
    envid: {
      required: false,
    },
    leid: {
      required: false,
    },
    svcid: {
      required: false,
    },
  },
};

/**
 * @deprecated Use `SkyAppConfigParams` instead.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyAppParamsConfig {
  public get params(): SkyuxConfigParams {
    return this.#_params;
  }

  #_params: SkyuxConfigParams;

  // eslint-disable-next-line @angular-eslint/prefer-inject -- constructor injection is required to maintain the public API for consumers who may instantiate this service directly (e.g. `new SkyAppParamsConfig(...)`).
  constructor(@Optional() args?: SkyAppParamsConfigArgs) {
    this.#_params = {
      ...DEFAULTS.params,
      ...(args?.params || {}),
    };
  }
}
