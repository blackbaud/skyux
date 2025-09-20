import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';

import { SkyFilterInlineItemHarnessFilters } from './filter-inline-item-harness-filters';

/**
 * Harness to interact with a filter inline item component in tests.
 */
export class SkyFilterInlineItemHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-filter-inline-item';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyFilterInlineItemHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyFilterInlineItemHarnessFilters,
  ): HarnessPredicate<SkyFilterInlineItemHarness> {
    return SkyFilterInlineItemHarness.getDataSkyIdPredicate(filters);
  }
}
