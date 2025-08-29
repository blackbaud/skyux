import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyFilterSummaryHarnessFilters } from './filter-summary-harness-filters';
import { SkyFilterSummaryItemHarness } from './filter-summary-item-harness';
import { SkyFilterSummaryItemHarnessFilters } from './filter-summary-item-harness-filters';

/**
 * Harness to interact with a filter summary component in tests.
 */
export class SkyFilterSummaryHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-filter-summary';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyFilterSummaryHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyFilterSummaryHarnessFilters,
  ): HarnessPredicate<SkyFilterSummaryHarness> {
    return SkyFilterSummaryHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets a specific filter summary item based on the filter criteria.
   * @param filter The filter criteria.
   */
  public async getItem(
    filter: SkyFilterSummaryItemHarnessFilters,
  ): Promise<SkyFilterSummaryItemHarness> {
    return await this.locatorFor(SkyFilterSummaryItemHarness.with(filter))();
  }

  /**
   * Gets an array of filter summary items based on the filter criteria.
   * If no filter is provided, returns all filter summary items.
   * @param filters The optional filter criteria.
   */
  public async getItems(
    filters?: SkyFilterSummaryItemHarnessFilters,
  ): Promise<SkyFilterSummaryItemHarness[]> {
    return await this.locatorForAll(
      SkyFilterSummaryItemHarness.with(filters || {}),
    )();
  }
}
