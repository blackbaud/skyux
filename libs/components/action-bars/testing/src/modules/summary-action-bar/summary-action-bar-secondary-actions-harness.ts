import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkySummaryActionBarSecondaryActionsHarnessFilters } from './summary-action-bar-secondary-actions-harness-filters';

/**
 * Harness for interacting with a checkbox group component in tests.
 */
export class SkySummaryActionBarSecondaryActionsHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-summary-action-bar-secondary-actions';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkySummaryActionBarSecondaryActionsHarness` that meets certain criteria.
   */
  public static with(
    filters: SkySummaryActionBarSecondaryActionsHarnessFilters,
  ): HarnessPredicate<SkySummaryActionBarSecondaryActionsHarness> {
    return SkySummaryActionBarSecondaryActionsHarness.getDataSkyIdPredicate(
      filters,
    );
  }
}
