import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyHrefHarnessFilters } from './href-harness-filters';

/**
 * Allows interaction with a SkyHref directive during testing.
 */
export class SkyHrefHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.sky-href';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyHrefHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyHrefHarnessFilters,
  ): HarnessPredicate<SkyHrefHarness> {
    return this.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the href attribute of the host element.
   */
  public async getHref(): Promise<string | null> {
    return await (await this.host()).getAttribute('href');
  }

  /**
   * Gets the visible text.
   */
  public async getText(): Promise<string> {
    return await this.isVisible().then(async (visible) => {
      if (visible) {
        return await (await this.host()).text();
      }
      return '';
    });
  }

  /**
   * Returns true if the text is visible.
   */
  public async isVisible(): Promise<boolean> {
    return await (await this.host())
      .matchesSelector('[hidden]')
      .then((hidden) => !hidden);
  }
}
