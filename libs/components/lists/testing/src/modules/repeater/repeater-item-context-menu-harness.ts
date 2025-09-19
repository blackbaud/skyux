import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';

import { SkyRepeaterItemContextMenuHarnessFilters } from './repeater-item-context-menu-harness-filters';

/**
 * Harness to query inside a repeater item context menu component in tests.
 */
export class SkyRepeaterItemContextMenuHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-repeater-item-context-menu';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyRepeaterItemContextMenuHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyRepeaterItemContextMenuHarnessFilters,
  ): HarnessPredicate<SkyRepeaterItemContextMenuHarness> {
    return SkyRepeaterItemContextMenuHarness.getDataSkyIdPredicate(filters);
  }
}
