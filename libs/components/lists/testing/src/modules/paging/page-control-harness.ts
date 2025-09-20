import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

import { SkyPageControlHarnessFilters } from './page-control-harness-filters';

/**
 * Harness to interact with a page control element in tests.
 * @internal
 */
export class SkyPageControlHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'li.sky-list-paging-link';

  #getButton = this.locatorFor('button.sky-paging-btn');

  public static with(
    filters: SkyPageControlHarnessFilters,
  ): HarnessPredicate<SkyPageControlHarness> {
    return new HarnessPredicate(SkyPageControlHarness, filters).addOption(
      'pageNumber',
      filters.pageNumber,
      (harness, pageNumber) =>
        harness
          .getText()
          .then(
            (actualPageNumber) => parseInt(actualPageNumber) === pageNumber,
          ),
    );
  }

  /**
   * Clicks the page button.
   */
  public async clickButton(): Promise<void> {
    await (await this.#getButton()).click();
  }

  /**
   * Gets the page button text.
   */
  public async getText(): Promise<string> {
    const button = await this.#getButton();

    return await button.text();
  }
}
