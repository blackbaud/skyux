import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyWaitHarness } from '@skyux/indicators/testing';

import { SkyLinkListHarnessFilters } from './link-list-harness-filters';

/**
 * Harness for interacting with a link list component in tests.
 * @internal
 */
export class SkyLinkListHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-link-list';

  #getHeading = this.locatorFor('h2.sky-font-heading-4');
  #getList = this.locatorFor('ul.sky-link-list');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyLinkListHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyLinkListHarnessFilters,
  ): HarnessPredicate<SkyLinkListHarness> {
    return SkyLinkListHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the link list's heading text. If there are no links, this will return `undefined`.
   */
  public async getHeadingText(): Promise<string | undefined> {
    return await this.#getHeading().then(
      (el) => el.text(),
      () => undefined,
    );
  }

  /**
   * Whether the link list is showing a list of links.
   */
  public async isVisible(): Promise<boolean> {
    return await this.#getList().then(
      () => true,
      () => false,
    );
  }

  /**
   * Gets the status of the wait indicator.
   */
  public async isWaiting(): Promise<boolean> {
    const waitHarness = await (await this.locatorFor(SkyWaitHarness))();
    return await waitHarness.isWaiting();
  }
}
