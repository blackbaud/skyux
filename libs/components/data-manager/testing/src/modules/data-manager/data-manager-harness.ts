import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyDataManagerHarnessFilters } from './data-manager-harness-filters';
import { SkyDataManagerToolbarHarness } from './data-manager-toolbar-harness';
import { SkyDataManagerToolbarHarnessFilters } from './data-manager-toolbar-harness-filters';
import { SkyDataViewHarness } from './data-view-harness';
import { SkyDataViewHarnessFilters } from './data-view-harness-filters';

/**
 * Harness to interact with a data manager toolbar section component in tests.
 */
export class SkyDataManagerHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-data-manager';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyDataManagerHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyDataManagerHarnessFilters,
  ): HarnessPredicate<SkyDataManagerHarness> {
    return SkyDataManagerHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets a harness for a data manager toolbar that meets certain criteria.
   */
  public async getToolbar(
    filter?: SkyDataManagerToolbarHarnessFilters,
  ): Promise<SkyDataManagerToolbarHarness> {
    return await this.locatorFor(
      SkyDataManagerToolbarHarness.with(filter || {}),
    )();
  }

  /**
   * Gets a harness for a specific data view that meets certain criteria.
   */
  public async getView(
    filter: SkyDataViewHarnessFilters,
  ): Promise<SkyDataViewHarness> {
    return await this.locatorFor(SkyDataViewHarness.with(filter))();
  }

  /**
   * Gets an array of all data views.
   */
  public async getViews(
    filters?: SkyDataViewHarnessFilters,
  ): Promise<SkyDataViewHarness[]> {
    const items = await this.locatorForAll(
      SkyDataViewHarness.with(filters || {}),
    )();

    if (filters && items.length === 0) {
      throw new Error(
        `Unable to find any data views with filter(s): ${JSON.stringify(filters)}`,
      );
    }

    return items;
  }
}
