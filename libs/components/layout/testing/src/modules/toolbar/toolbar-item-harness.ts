import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';

import { SkyToolbarItemHarnessFilters } from './toolbar-item-harness-filters';

/**
 * Harness to interact with a toolbar item component in tests.
 */
export class SkyToolbarItemHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-toolbar-item';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyToolbarItemHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyToolbarItemHarnessFilters,
  ): HarnessPredicate<SkyToolbarItemHarness> {
    return SkyToolbarItemHarness.getDataSkyIdPredicate(filters);
  }
}
