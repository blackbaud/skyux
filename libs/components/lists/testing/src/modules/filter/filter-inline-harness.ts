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
   * Gets a specific filter inline item based on the filter criteria.
   * @param filter The filter criteria.
   */
  public async getItem(
    filter: SkyFilterInlineItemHarnessFilters,
  ): Promise<SkyFilterInlineItemHarness> {
    return await this.locatorFor(SkyFilterInlineItemHarness.with(filter))();
  }

  /**
   * Gets an array of filter inline items based on the filter criteria.
   * If no filter is provided, returns all filter inline items.
   * @param filters The optional filter criteria.
   */
  public async getItems(
    filters?: SkyFilterInlineItemHarnessFilters,
  ): Promise<SkyFilterInlineItemHarness[]> {
    return await this.locatorForAll(
      SkyFilterInlineItemHarness.with(filters || {}),
    )();
  }
}
