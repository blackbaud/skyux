import { Injectable } from '@angular/core';

import { SkyuxConfigParams } from './config-params';

/**
 * @deprecated
 */
@Injectable()
export class SkyAppParamsConfigArgs {
  /**
   * A list of query parameters that are allowed at runtime.
   */
  public params?: SkyuxConfigParams;
}
