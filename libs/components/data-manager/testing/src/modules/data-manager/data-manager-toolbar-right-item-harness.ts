import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';

import { SkyDataManagerToolbarRightItemHarnessFilters } from './data-manager-toolbar-right-item-harness-filters';

/**
 * Harness to interact with a toolbar view actions component in tests.
 */
export class SkyDataManagerToolbarRightItemHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-data-manager-toolbar-right-item';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyDataManagerToolbarRightItemHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyDataManagerToolbarRightItemHarnessFilters,
  ): HarnessPredicate<SkyDataManagerToolbarRightItemHarness> {
    return SkyDataManagerToolbarRightItemHarness.getDataSkyIdPredicate(filters);
  }
}
