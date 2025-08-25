import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyNavbarHarnessFilters } from './navbar-harness-filters';
import { SkyNavbarItemHarness } from './navbar-item-harness';
import { SkyNavbarItemHarnessFilters } from './navbar-item-harness-filters';

/**
 * Harness for interacting with a navbar component in tests.
 */
export class SkyNavbarHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-navbar';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyNavbarHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyNavbarHarnessFilters,
  ): HarnessPredicate<SkyNavbarHarness> {
    return SkyNavbarHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets a harness for a specific navbar item that meets certain criteria.
   */
  public async getItem(
    filter: SkyNavbarItemHarnessFilters,
  ): Promise<SkyNavbarItemHarness> {
    return await this.locatorFor(SkyNavbarItemHarness.with(filter))();
  }

  /**
   * Gets an array of all navbar items.
   */
  public async getItems(
    filters?: SkyNavbarItemHarnessFilters,
  ): Promise<SkyNavbarItemHarness[]> {
    return await this.locatorForAll(SkyNavbarItemHarness.with(filters || {}))();
  }
}
