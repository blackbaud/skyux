// #region imports
import { Provider, Type } from '@angular/core';

import { SkyToastInstance } from './toast-instance';
import { SkyToastConfig } from './types/toast-config';

// #endregion

let toastCount = 0;

/**
 * @internal
 */
export class SkyToast {
  public get bodyComponent(): Type<unknown> {
    return this.#bodyComponent;
  }

  public get bodyComponentProviders(): Provider[] {
    return this.#bodyComponentProviders;
  }

  public get config(): SkyToastConfig | undefined {
    return this.#config;
  }

  public get instance(): SkyToastInstance {
    return this.#instance;
  }

  public isRendered = false;

  public toastId: number;

  #bodyComponent: Type<unknown>;
  #bodyComponentProviders: Provider[];
  #config: SkyToastConfig | undefined;

  #instance: SkyToastInstance;

  constructor(
    bodyComponent: Type<unknown>,
    bodyComponentProviders: Provider[],
    instance: SkyToastInstance,
    config?: SkyToastConfig
  ) {
    this.#bodyComponent = bodyComponent;
    this.#bodyComponentProviders = bodyComponentProviders;
    this.#instance = instance;
    this.#config = config;

    this.toastId = ++toastCount;
  }
}
