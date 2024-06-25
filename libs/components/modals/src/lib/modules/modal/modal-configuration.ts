import { Injectable } from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkyModalConfiguration {
  public fullPage?: boolean;
  public size?: string;
  public ariaDescribedBy?: string;
  public ariaLabelledBy?: string;
  public ariaRole?: string;
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
