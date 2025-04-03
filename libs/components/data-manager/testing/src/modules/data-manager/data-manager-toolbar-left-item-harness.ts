import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';

import { SkyDataManagerToolbarLeftItemHarnessFilters } from './data-manager-toolbar-left-item-harness-filters';

/**
 * Harness to interact with a data manager toolbar left item component in tests.
 */
export class SkyDataManagerToolbarLeftItemHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-data-manager-toolbar-left-item';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyDataManagerToolbarLeftItemHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyDataManagerToolbarLeftItemHarnessFilters,
  ): HarnessPredicate<SkyDataManagerToolbarLeftItemHarness> {
    return SkyDataManagerToolbarLeftItemHarness.getDataSkyIdPredicate(filters);
  }
}
