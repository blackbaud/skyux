import { Injectable } from '@angular/core';

import { SkyuxConfigHost } from './config';

const DEFAULTS: SkyuxConfigHost = {
  frameOptions: {
    none: true,
  },
  url: 'https://host.nxt.blackbaud.com/',
};

/**
 * Host configuration for components and applications.
 * @deprecated Use `SkyAppConfig.skyux.host` instead.
 */
@Injectable()
export class SkyAppConfigHost {
  public get host(): SkyuxConfigHost {
    return this.#_host;
  }

  #_host!: SkyuxConfigHost;

  public init(config?: SkyuxConfigHost): void {
    this.#_host = {
      ...DEFAULTS,
      ...(config || {}),
    };
  }
}
