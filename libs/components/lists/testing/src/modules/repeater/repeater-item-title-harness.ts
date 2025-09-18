import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';

import { SkyRepeaterItemTitleHarnessFilters } from './repeater-item-title-harness-filters';

/**
 * Harness to interact with a repeater item title component in tests.
 */
export class SkyRepeaterItemTitleHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-repeater-item-title';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyRepeaterItemTitleHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyRepeaterItemTitleHarnessFilters,
  ): HarnessPredicate<SkyRepeaterItemTitleHarness> {
    return SkyRepeaterItemTitleHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the title text.
   */
  public async getTitleText(): Promise<string> {
    return await (await this.host()).text();
  }
}
