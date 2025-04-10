import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';

import { SkySummaryActionBarSummaryHarnessFilters } from './summary-action-bar-summary-harness-filters';

/**
 * Harness for interacting with a summary action bar summary component in tests.
 * Use this harness to query components inside the `sky-summary-action-bar-summary` component.
 */
export class SkySummaryActionBarSummaryHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-summary-action-bar-summary';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkySummaryActionBarSummaryHarness` that meets certain criteria.
   */
  public static with(
    filters: SkySummaryActionBarSummaryHarnessFilters,
  ): HarnessPredicate<SkySummaryActionBarSummaryHarness> {
    return SkySummaryActionBarSummaryHarness.getDataSkyIdPredicate(filters);
  }
}
