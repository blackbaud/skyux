import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyFilterInlineHarnessFilters } from './filter-inline-harness-filters';
import { SkyFilterInlineItemHarness } from './filter-inline-item-harness';
import { SkyFilterInlineItemHarnessFilters } from './filter-inline-item-harness-filters';

/**
 * Harness to interact with a filter inline component in tests.
 */
export class SkyFilterInlineHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-filter-inline';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyFilterInlineHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyFilterInlineHarnessFilters,
  ): HarnessPredicate<SkyFilterInlineHarness> {
    return SkyFilterInlineHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets a harness for a specific toolbar item that meets certain criteria.
   */
  public async getItem(
    filter: SkyFilterInlineItemHarnessFilters,
  ): Promise<SkyFilterInlineItemHarness> {
    return await this.locatorFor(SkyFilterInlineItemHarness.with(filter))();
  }

  /**
   * Gets an array of all toolbar items.
   */
  public async getItems(
    filters?: SkyFilterInlineItemHarnessFilters,
  ): Promise<SkyFilterInlineItemHarness[]> {
    const items = await this.locatorForAll(
      SkyFilterInlineItemHarness.with(filters || {}),
    )();

    if (items.length === 0 && filters) {
      throw new Error(
        `Unable to find any filter inline items with filter(s): ${JSON.stringify(filters)}`,
      );
    }

    return items;
  }
}
