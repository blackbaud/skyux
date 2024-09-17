import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyColorpickerHarnessFilters } from './colorpicker-harness.filters';

export class SkyColorpickerHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-colorpicker';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyColorpickerHarness` that meets certain criteria
   */
  public static with(
    filters: SkyColorpickerHarnessFilters,
  ): HarnessPredicate<SkyColorpickerHarness> {
    return SkyColorpickerHarness.getDataSkyIdPredicate(filters);
  }
}
