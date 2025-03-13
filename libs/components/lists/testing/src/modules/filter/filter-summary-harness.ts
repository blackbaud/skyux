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
   * Gets a harness for a specific toolbar item that meets certain criteria.
   */
  public async getItem(
    filter: SkyFilterSummaryItemHarnessFilters,
  ): Promise<SkyFilterSummaryItemHarness> {
    return await this.locatorFor(SkyFilterSummaryItemHarness.with(filter))();
  }

  /**
   * Gets an array of all toolbar items.
   */
  public async getItems(
    filters?: SkyFilterSummaryItemHarnessFilters,
  ): Promise<SkyFilterSummaryItemHarness[]> {
    const items = await this.locatorForAll(
      SkyFilterSummaryItemHarness.with(filters || {}),
    )();

    if (items.length === 0) {
      if (filters) {
        throw new Error(
          `Unable to find any filter summary items with filter(s): ${JSON.stringify(filters)}`,
        );
      }
      throw new Error('Unable to find any filter summary items.');
    }

    return items;
  }
}
