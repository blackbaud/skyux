import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';

import { SkyListSummaryHarnessFilters } from './list-summary-harness-filters';
import { SkyListSummaryItemHarness } from './list-summary-item-harness';
import { SkyListSummaryItemHarnessFilters } from './list-summary-item-harness-filters';

/**
 * Harness for interacting with a list summary component in tests.
 */
export class SkyListSummaryHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-list-summary';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyListSummaryHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyListSummaryHarnessFilters,
  ): HarnessPredicate<SkyListSummaryHarness> {
    return SkyListSummaryHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets a specific list summary item based on the filter criteria.
   * @param filter The filter criteria.
   */
  public async getSummaryItem(
    filter: SkyListSummaryItemHarnessFilters,
  ): Promise<SkyListSummaryItemHarness> {
    return await this.locatorFor(SkyListSummaryItemHarness.with(filter))();
  }

  /**
   * Gets an array of list summary items based on the filter criteria.
   * If no filter is provided, returns all summary items.
   * @param filters The optional filter criteria.
   */
  public async getSummaryItems(
    filters?: SkyListSummaryItemHarnessFilters,
  ): Promise<SkyListSummaryItemHarness[]> {
    return await this.locatorForAll(
      SkyListSummaryItemHarness.with(filters || {}),
    )();
  }
}
