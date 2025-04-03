import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';

import { SkyDataManagerToolbarSectionHarnessFilters } from './data-manager-toolbar-section-harness-filters';

/**
 * Harness to interact with a data manager toolbar section component in tests.
 */
export class SkyDataManagerToolbarSectionHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-data-manager-toolbar-section';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyDataManagerToolbarSectionHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyDataManagerToolbarSectionHarnessFilters,
  ): HarnessPredicate<SkyDataManagerToolbarSectionHarness> {
    return SkyDataManagerToolbarSectionHarness.getDataSkyIdPredicate(filters);
  }
}
