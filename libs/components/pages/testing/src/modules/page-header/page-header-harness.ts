import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyPageHeaderHarnessFilters } from './page-header-harness-filters';

/**
 * Harness for interacting with a page header component in tests.
 */
export class SkyPageHeaderHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-page-header';

  #getTitle = this.locatorFor('.sky-page-header-page-title');
  #getParentLink = this.locatorForOptional('.sky-page-header-parent-link');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyPageHeaderHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyPageHeaderHarnessFilters,
  ): HarnessPredicate<SkyPageHeaderHarness> {
    return SkyPageHeaderHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the current page title.
   */
  public async getPageTitle(): Promise<string | undefined> {
    const title = await this.#getTitle();

    return await title.text();
  }

  /**
   * Gets the current page title.
   */
  public async getParentLinkText(): Promise<string> {
    const parentLink = await this.#getParentLink();

    if (parentLink) {
      return await parentLink.text();
    }

    throw new Error('No parent link was found in the page header.');
  }
}
