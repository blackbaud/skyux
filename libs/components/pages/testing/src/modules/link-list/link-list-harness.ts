import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyWaitHarness } from '@skyux/indicators/testing';

import { SkyLinkListHarnessFilters } from './link-list-harness-filters';
import { SkyLinkListItemHarness } from './link-list-item-harness';
import { SkyLinkListItemHarnessFilters } from './link-list-item-harness-filters';

/**
 * Harness for interacting with a link list component in tests.
 */
export class SkyLinkListHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector =
    'sky-link-list, sky-link-list-recently-accessed, sky-modal-link-list';

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
    const waitHarness = await this.locatorFor(SkyWaitHarness)();
    return await waitHarness.isWaiting();
  }

  /**
   * Gets a specific link list item that meets certain criteria.
   */
  public async getListItem(
    filter: SkyLinkListItemHarnessFilters,
  ): Promise<SkyLinkListItemHarness> {
    return await this.locatorFor(SkyLinkListItemHarness.with(filter))();
  }

  /**
   * Gets an array of link list items.
   */
  public async getListItems(
    filter?: SkyLinkListItemHarnessFilters,
  ): Promise<SkyLinkListItemHarness[]> {
    return await this.locatorForAll(
      SkyLinkListItemHarness.with(filter || {}),
    )();
  }
}
