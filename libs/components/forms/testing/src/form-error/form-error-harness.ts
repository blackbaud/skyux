import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyFormErrorHarnessFilters } from './form-error-harness.filters';

export class SkyFormErrorHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-dropdown';

  #getFormError = this.locatorFor('.sky-form-error');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyFormErrorHarness` that meets certain criteria
   */
  public static with(
    filters: SkyFormErrorHarnessFilters,
  ): HarnessPredicate<SkyFormErrorHarness> {
    return SkyFormErrorHarness.getDataSkyIdPredicate(filters);
  }
}
