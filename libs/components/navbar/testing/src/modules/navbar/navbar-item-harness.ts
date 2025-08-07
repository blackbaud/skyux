import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';

import { SkyNavbarItemHarnessFilters } from './navbar-item-harness-filters';

/**
 * Harness to interact with a navbar item component in tests.
 */
export class SkyNavbarItemHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-navbar-item';

  #getItem = this.locatorFor('.sky-navbar-item');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyNavbarItemHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyNavbarItemHarnessFilters,
  ): HarnessPredicate<SkyNavbarItemHarness> {
    return SkyNavbarItemHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Whether the navbar item is active.
   */
  public async isActive(): Promise<boolean> {
    return await (await this.#getItem()).hasClass('sky-navbar-item-active');
  }
}
