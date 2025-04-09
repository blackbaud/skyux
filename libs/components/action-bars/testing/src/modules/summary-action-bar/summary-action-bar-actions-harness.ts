import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkySummaryActionBarActionsHarnessFilters } from './summary-action-bar-actions-harness-filters';

/**
 * Harness for interacting with a checkbox group component in tests.
 */
export class SkySummaryActionBarActionsHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-summary-action-bar-actions';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkySummaryActionBarActionsHarness` that meets certain criteria.
   */
  public static with(
    filters: SkySummaryActionBarActionsHarnessFilters,
  ): HarnessPredicate<SkySummaryActionBarActionsHarness> {
    return SkySummaryActionBarActionsHarness.getDataSkyIdPredicate(filters);
  }
}
