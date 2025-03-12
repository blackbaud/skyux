import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyVerticalTabContentHarnessFilters } from './vertical-tab-content-harness-filters';

/**
 * Harness for interacting with a vertical tab in tests.
 */
export class SkyVerticalTabContentHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.sky-vertical-tabset-content';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyVerticalTabContentHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyVerticalTabContentHarnessFilters,
  ): HarnessPredicate<SkyVerticalTabContentHarness> {
    return SkyVerticalTabContentHarness.getDataSkyIdPredicate(filters);
  }
}
