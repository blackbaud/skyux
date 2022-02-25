import { Injectable } from '@angular/core';

import { SkyuxConfigParams } from './config-params';

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
 * @deprecated Use `SkyAppConfig.skyux.params` instead.
 */
@Injectable()
export class SkyAppConfigParams {
  public get params(): SkyuxConfigParams {
    return this._params;
  }

  private _params: SkyuxConfigParams;

  public init(params?: SkyuxConfigParams): void {
    this._params = {
      ...DEFAULTS.params,
      ...(params || {}),
    };
  }
}
