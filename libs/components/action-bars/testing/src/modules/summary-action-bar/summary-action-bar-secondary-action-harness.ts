import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkySummaryActionBarSecondaryActionHarnessFilters } from './summary-action-bar-secondary-action-harness-filters';

/**
 * Harness for interacting with a checkbox group component in tests.
 */
export class SkySummaryActionBarSecondaryActionHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-summary-action-bar-secondary-action';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkySummaryActionBarSecondaryActionHarness` that meets certain criteria.
   */
  public static with(
    filters: SkySummaryActionBarSecondaryActionHarnessFilters,
  ): HarnessPredicate<SkySummaryActionBarSecondaryActionHarness> {
    return SkySummaryActionBarSecondaryActionHarness.getDataSkyIdPredicate(
      filters,
    );
  }
}
