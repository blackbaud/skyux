import { HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyPageControlHarness } from './page-control-harness';
import { SkyPagingContentHarness } from './paging-content-harness';
import { SkyPagingHarnessFilters } from './paging-harness-filters';

/**
 * Harness for interacting with a paging component in tests.
 */
export class SkyPagingHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-paging';

  #getNextButton = this.locatorForOptional('li button.sky-paging-btn-next');
  #getPreviousButton = this.locatorForOptional(
    'li button.sky-paging-btn-previous',
  );

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyPagingHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyPagingHarnessFilters,
  ): HarnessPredicate<SkyPagingHarness> {
    return SkyPagingHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the next button.
   */
  public async clickNextButton(): Promise<void> {
    const button = await this.#getNextButton();

    if (button === null) {
      throw new Error('Could not find the next button.');
    }

    if (await this.#buttonIsDisabled(button)) {
      throw new Error(
        'Could not click the next button because it is disabled.',
      );
    }

    await button.click();
  }

  /**
   * Clicks the page button with the requested number. Throws an error if that button is not present.
   */
  public async clickPageButton(pageNumber: number): Promise<void> {
    const button = await this.locatorForOptional(
      SkyPageControlHarness.with({ pageNumber: pageNumber }),
    )();

    if (button === null) {
      throw new Error(`Could not find page button ${pageNumber}.`);
    }

    await button.clickButton();
  }

  /**
   * Clicks the previous button.
   */
  public async clickPreviousButton(): Promise<void> {
    const button = await this.#getPreviousButton();

    if (button === null) {
      throw new Error('Could not find the previous button.');
    }

    if (await this.#buttonIsDisabled(button)) {
      throw new Error(
        'Could not click the previous button because it is disabled.',
      );
    }

    await button.click();
  }

  /**
   * Gets the current page number.
   */
  public async getCurrentPage(): Promise<number> {
    const currentPage = await this.locatorForOptional(
      'button.sky-paging-current',
    )();

    if (currentPage === null) {
      throw new Error('Could not find current page.');
    }

    return parseInt(await currentPage.text());
  }

  /**
   * Gets the paging content.
   */
  public async getPagingContent(): Promise<SkyPagingContentHarness> {
    return await this.locatorFor(SkyPagingContentHarness)();
  }

  public async getPagingLabel(): Promise<string> {
    const pageNav = await this.locatorForOptional('nav.sky-paging')();

    if (pageNav === null) {
      throw new Error('Could not find paging label.');
    }

    return (await pageNav.getAttribute('aria-label')) as string;
  }

  async #buttonIsDisabled(button: TestElement): Promise<boolean> {
    const disabled = await button.getAttribute('disabled');
    return disabled !== null;
  }
}
