// #region imports
import { Provider } from '@angular/core';

import { SkyToastConfig } from './types/toast-config';

import { SkyToastInstance } from './toast-instance';
// #endregion

let toastCount = 0;

/**
 * @internal
 */
export class SkyToast {
  public get bodyComponent(): any {
    return this._bodyComponent;
  }

  public get bodyComponentProviders(): Provider[] {
    return this._bodyComponentProviders;
  }

  public get config(): SkyToastConfig {
    return this._config;
  }

  public get instance(): SkyToastInstance {
    return this._instance;
  }

  public set instance(value: SkyToastInstance) {
    if (!this._instance) {
      this._instance = value;
    }
  }

  public isRendered: boolean;

  public toastId: number;

  private _instance: SkyToastInstance;

  constructor(
    private _bodyComponent: any,
    private _bodyComponentProviders: Provider[],
    private _config: SkyToastConfig
  ) {
    this.toastId = ++toastCount;
  }
}
