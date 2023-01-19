import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyHrefHarnessFilters } from './href-harness-filters';

export class SkyHrefHarness extends SkyComponentHarness {
  static hostSelector = '[skyHref]';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyHrefHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyHrefHarnessFilters
  ): HarnessPredicate<SkyHrefHarness> {
    return this.getDataSkyIdPredicate(filters);
  }

  async getHref(): Promise<string | null> {
    return this.forceStabilize().then(async () => {
      return await (await this.host()).getAttribute('href');
    });
  }

  async getLinkText(): Promise<string> {
    return this.forceStabilize().then(async () => {
      return await (await this.host()).text();
    });
  }

  async isVisible(): Promise<boolean> {
    return this.forceStabilize().then(async () => {
      return await (await this.host())
        .matchesSelector('[hidden]')
        .then((hidden) => !hidden);
    });
  }

  async isLinked(): Promise<boolean> {
    return this.getHref().then((href) => !!href);
  }
}
