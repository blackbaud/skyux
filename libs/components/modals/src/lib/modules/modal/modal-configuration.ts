import { Injectable } from '@angular/core';

import { SkyModalConfigurationSizeType } from './modal-configuration-size-type';

/**
 * @internal
 */
@Injectable()
export class SkyModalConfiguration {
  public fullPage?: boolean;
  public size?: SkyModalConfigurationSizeType;
  /**
   * @deprecated
   */
  public ariaDescribedBy?: string;
  /**
   * @deprecated
   */
  public ariaLabelledBy?: string;
  public ariaRole?: string;
  /**
   * @deprecated
   */
  public tiledBody?: boolean;
  /**
   * @deprecated
   */
  public helpKey?: string;
  public wrapperClass?: string;

  constructor() {
    this.size = 'medium';
  }
}
