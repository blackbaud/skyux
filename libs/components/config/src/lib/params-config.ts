import { Injectable, inject } from '@angular/core';

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

  readonly #args = inject(SkyAppParamsConfigArgs, { optional: true });

  constructor() {
    this.#_params = {
      ...DEFAULTS.params,
      ...(this.#args?.params || {}),
    };
  }
}
