import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyTextExpandHarnessFilters } from './text-expand-harness-filters';
import { SkyTextExpandModalHarness } from './text-expand-modal-harness';

/**
 * Harness for interacting with a text expand component in tests.
 */
export class SkyTextExpandHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-text-expand';

  #documentRootLocator = this.documentRootLocatorFactory();
  #getExpandCollapseButton = this.locatorForOptional(
    '.sky-text-expand-see-more',
  );
  #getText = this.locatorFor('.sky-text-expand-text');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyTextExpandHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyTextExpandHarnessFilters,
  ): HarnessPredicate<SkyTextExpandHarness> {
    return SkyTextExpandHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the button element to expand or collapse text.
   */
  public async clickSeeMoreButton(): Promise<void> {
    const button = await this.#getExpandCollapseButton();

    if (button === null) {
      throw Error('Could not find button element.');
    }

    await button.click();
  }

  /**
   * Gets the text content of the text expand.
   */
  public async getText(): Promise<string> {
    return await (await this.#getText()).text();
  }

  public async getModal(): Promise<SkyTextExpandModalHarness> {
    const modal = await this.#documentRootLocator.locatorForOptional(
      SkyTextExpandModalHarness,
    )();

    if (modal === null) {
      throw Error('Could not find text expand modal.');
    }

    return modal;
  }
}
