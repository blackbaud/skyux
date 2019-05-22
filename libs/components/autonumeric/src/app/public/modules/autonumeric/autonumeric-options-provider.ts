import {
  Injectable
} from '@angular/core';

import {
  SkyAutonumericOptions
} from './autonumeric-options';

/**
 * @description Provides options to the underlying autoNumeric library.
 * See: https://github.com/autoNumeric/autoNumeric
 */
@Injectable()
export class SkyAutonumericOptionsProvider {

  public getConfig(): SkyAutonumericOptions {
    return {};
  }

}
