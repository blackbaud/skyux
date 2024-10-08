import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyProgressIndicatorFilters } from './progress-indicator-harness-filters';
import { SkyProgressIndicatorItemHarness } from './progress-indicator-item-harness';
import { SkyProgressIndicatorItemFilters } from './progress-indicator-item-harness-filters';

export class SkyProgressIndicatorHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-progress-indicator';

  #getProgressIndicator = this.locatorFor('.sky-progress-indicator');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyProgressIndicatorHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyProgressIndicatorFilters,
  ): HarnessPredicate<SkyProgressIndicatorHarness> {
    return SkyProgressIndicatorHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets a specific progress indicator item based on filters.
   */
  public async getItem(
    filter: SkyProgressIndicatorItemFilters,
  ): Promise<SkyProgressIndicatorItemHarness> {
    const item = await this.locatorFor(
      SkyProgressIndicatorItemHarness.with(filter),
    )();

    if (!item) {
      throw new Error(
        `Unable to find a progress indicator item with filter(s): ${JSON.stringify(filter)}`,
      );
    }

    return item;
  }

  /**
   * Gets an array of all progress indicator items.
   */
  public async getItems(
    filters?: SkyProgressIndicatorItemFilters,
  ): Promise<SkyProgressIndicatorItemHarness[]> {
    const items = await this.locatorForAll(
      SkyProgressIndicatorItemHarness.with(filters || {}),
    )();

    if (items.length === 0) {
      if (filters) {
        throw new Error(
          `Unable to find any progress indicator items with filter(s): ${JSON.stringify(filters)}`,
        );
      }
      throw new Error('Unable to find any progress indicator items.');
    }

    return items;
  }

  /**
   * Whether the progress indicator is passive.
   */
  public async isPassive(): Promise<boolean> {
    console.log(await this.host());
    return (await this.#getProgressIndicator()).hasClass(
      'sky-progress-indicator-passive',
    );
  }
}
