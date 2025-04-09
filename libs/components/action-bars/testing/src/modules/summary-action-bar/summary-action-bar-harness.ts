import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkySummaryActionBarHarnessFilters } from './summary-action-bar-harness-filters';

/**
 * Harness for interacting with a checkbox group component in tests.
 */
export class SkySummaryActionBarHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-summary-action-bar';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkySummaryActionBarHarness` that meets certain criteria.
   */
  public static with(
    filters: SkySummaryActionBarHarnessFilters,
  ): HarnessPredicate<SkySummaryActionBarHarness> {
    return SkySummaryActionBarHarness.getDataSkyIdPredicate(filters);
  }
}
