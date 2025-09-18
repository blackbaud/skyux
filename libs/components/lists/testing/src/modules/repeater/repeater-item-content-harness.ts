import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';

import { SkyRepeaterItemContentHarnessFilters } from './repeater-item-content-harness-filters';

/**
 * Harness to query inside a repeater item content component in tests.
 */
export class SkyRepeaterItemContentHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-repeater-item-content';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyRepeaterItemContentHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyRepeaterItemContentHarnessFilters,
  ): HarnessPredicate<SkyRepeaterItemContentHarness> {
    return SkyRepeaterItemContentHarness.getDataSkyIdPredicate(filters);
  }
}
