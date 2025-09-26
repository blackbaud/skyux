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

  #getDataManager = this.locatorFor('.sky-data-manager');

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
   * Gets the type of dock style on the data manager.
   */
  public async getDockType(): Promise<string> {
    return (await (
      await this.#getDataManager()
    ).hasClass('sky-data-manager-dock-fill'))
      ? 'fill'
      : 'none';
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
   * Gets a specific data view based on the filter criteria.
   * @param filter The filter criteria.
   */
  public async getView(
    filter: SkyDataViewHarnessFilters,
  ): Promise<SkyDataViewHarness> {
    return await this.locatorFor(SkyDataViewHarness.with(filter))();
  }

  /**
   * Gets an array of data views based on the filter criteria.
   * If no filter is provided, returns all data views.
   * @param filters The optional filter criteria.
   */
  public async getViews(
    filters?: SkyDataViewHarnessFilters,
  ): Promise<SkyDataViewHarness[]> {
    return await this.locatorForAll(SkyDataViewHarness.with(filters || {}))();
  }
}
