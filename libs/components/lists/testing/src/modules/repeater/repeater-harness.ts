import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyRepeaterHarnessFilters } from './repeater-harness-filters';
import { SkyRepeaterItemHarness } from './repeater-item-harness';
import { SkyRepeaterItemHarnessFilters } from './repeater-item-harness-filters';

/**
 * Harness for interacting with a repeater component in tests.
 */
export class SkyRepeaterHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-repeater';

  #getRepeater = this.locatorFor('.sky-repeater');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyRepeaterHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyRepeaterHarnessFilters,
  ): HarnessPredicate<SkyRepeaterHarness> {
    return SkyRepeaterHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets a specific repeater item based on the filter criteria.
   * @param filter The filter criteria.
   */
  public async getRepeaterItem(
    filter: SkyRepeaterItemHarnessFilters,
  ): Promise<SkyRepeaterItemHarness> {
    return await this.locatorFor(SkyRepeaterItemHarness.with(filter))();
  }

  /**
   * Gets an array of repeater items based on the filter criteria.
   * If no filter is provided, returns all repeater items.
   * @param filters The optional filter criteria.
   */
  public async getRepeaterItems(
    filters?: SkyRepeaterItemHarnessFilters,
  ): Promise<SkyRepeaterItemHarness[]> {
    return await this.locatorForAll(
      SkyRepeaterItemHarness.with(filters || {}),
    )();
  }

  /**
   * Gets the aria-label for the repeater list
   */
  public async getAriaLabel(): Promise<string | null> {
    return await (await this.#getRepeater()).getAttribute('aria-label');
  }
}
