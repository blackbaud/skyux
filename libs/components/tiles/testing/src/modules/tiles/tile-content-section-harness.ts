import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';

import { SkyTileContentSectionHarnessFilters } from './tile-content-section-harness-filters';

/**
 * Harness to interact with a tile content section component in tests.
 */
export class SkyTileContentSectionHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-tile-content-section';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyTileContentSectionHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyTileContentSectionHarnessFilters,
  ): HarnessPredicate<SkyTileContentSectionHarness> {
    return SkyTileContentSectionHarness.getDataSkyIdPredicate(filters);
  }
}
