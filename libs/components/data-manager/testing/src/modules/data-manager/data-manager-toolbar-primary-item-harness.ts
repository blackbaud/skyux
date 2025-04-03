import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';

import { SkyDataManagerToolbarPrimaryItemHarnessFilters } from './data-manager-toolbar-primary-item-harness-filters';

/**
 * Harness to interact with a data manager toolbar primary item component in tests.
 */
export class SkyDataManagerToolbarPrimaryItemHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-data-manager-toolbar-primary-item';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyDataManagerToolbarPrimaryItemHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyDataManagerToolbarPrimaryItemHarnessFilters,
  ): HarnessPredicate<SkyDataManagerToolbarPrimaryItemHarness> {
    return SkyDataManagerToolbarPrimaryItemHarness.getDataSkyIdPredicate(
      filters,
    );
  }
}
