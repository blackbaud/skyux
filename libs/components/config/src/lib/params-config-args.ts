import { Injectable } from '@angular/core';

import { SkyuxConfigParams } from './config-params';

/**
 * @deprecated
 */
@Injectable()
export class SkyAppParamsConfigArgs {
  /**
   * The list of query parameters allowed at runtime.
   */
  public params?: SkyuxConfigParams;
}
