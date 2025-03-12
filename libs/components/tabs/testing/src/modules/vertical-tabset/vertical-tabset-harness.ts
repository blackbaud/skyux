import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyVerticalTabsetHarnessFilters } from './vertical-tabset-harness-filters';

/**
 * Harness for interacting with the vertical tabset component in tests.
 */
export class SkyVerticalTabsetHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-vertical-tabset';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyVerticalTabsetHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyVerticalTabsetHarnessFilters,
  ): HarnessPredicate<SkyVerticalTabsetHarness> {
    return SkyVerticalTabsetHarness.getDataSkyIdPredicate(filters);
  }
}
