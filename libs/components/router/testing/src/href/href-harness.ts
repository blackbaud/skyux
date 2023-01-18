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

  async getHref(): Promise<string> {
    const link = await this.host();
    return link.getAttribute('href').then((href) => `${href}`);
  }

  async getLinkText(): Promise<string> {
    const link = await this.host();
    return link.text();
  }

  async isVisible(): Promise<boolean> {
    const link = await this.host();
    return link.matchesSelector('[hidden]').then((hidden) => !hidden);
  }

  async isLinked(): Promise<boolean> {
    const link = await this.host();
    return link.getAttribute('href').then((href) => !!href);
  }
}
