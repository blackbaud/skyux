import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkySummaryActionBarCancelHarnessFilters } from './summary-action-bar-cancel-harness-filters';

/**
 * Harness for interacting with a checkbox group component in tests.
 */
export class SkySummaryActionBarCancelHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-summary-action-bar-cancel';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkySummaryActionBarCancelHarness` that meets certain criteria.
   */
  public static with(
    filters: SkySummaryActionBarCancelHarnessFilters,
  ): HarnessPredicate<SkySummaryActionBarCancelHarness> {
    return SkySummaryActionBarCancelHarness.getDataSkyIdPredicate(filters);
  }
}
