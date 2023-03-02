import { Injectable } from '@angular/core';

import { SkyAutonumericOptions } from './autonumeric-options';

/**
 * Provides options to the underlying [AutoNumeric library](https://github.com/autoNumeric/autoNumeric).
 * This can set global options on multiple input fields.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyAutonumericOptionsProvider {
  /**
   * The value for a settings object to pass to the AutoNumeric library.
   * This overrides any default options specified by the `skyAutonumeric` attribute.
   */
  public getConfig(): SkyAutonumericOptions {
    return {};
  }
}
