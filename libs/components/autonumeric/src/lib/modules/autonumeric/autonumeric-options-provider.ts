import { Injectable } from '@angular/core';

import { SkyAutonumericOptions } from './autonumeric-options';

/**
 * Provides options to the underlying [autoNumeric utility](https://github.com/autoNumeric/autoNumeric).
 * This can set global options on multiple input fields.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyAutonumericOptionsProvider {
  /**
   * Specifies the value for a settings object to pass to the autoNumeric utility.
   * This overrides any default options specified by the `skyAutonumeric` attribute.
   */
  public getConfig(): SkyAutonumericOptions {
    return {};
  }
}
