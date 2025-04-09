import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkySummaryActionBarPrimaryActionHarnessFilters } from './summary-action-bar-primary-action-harness-filters';

/**
 * Harness for interacting with a checkbox group component in tests.
 */
export class SkySummaryActionBarPrimaryActionHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-summary-action-bar-primary-action';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkySummaryActionBarPrimaryActionHarness` that meets certain criteria.
   */
  public static with(
    filters: SkySummaryActionBarPrimaryActionHarnessFilters,
  ): HarnessPredicate<SkySummaryActionBarPrimaryActionHarness> {
    return SkySummaryActionBarPrimaryActionHarness.getDataSkyIdPredicate(
      filters,
    );
  }
}
