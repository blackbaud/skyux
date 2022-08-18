import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

import { SkyTokenHarnessFilters } from './token-harness-filters';

/**
 * Harness for interacting with a token component in tests.
 */
export class SkyTokenHarness extends ComponentHarness {
  public static hostSelector = 'sky-token';

  #getDismissButton = this.locatorFor('button.sky-token-btn-close');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyTokenHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyTokenHarnessFilters
  ): HarnessPredicate<SkyTokenHarness> {
    return new HarnessPredicate(this, filters).addOption(
      'textContent',
      filters.textContent,
      async (harness, test) =>
        HarnessPredicate.stringMatches(
          await (await harness.host()).text(),
          test
        )
    );
  }

  public async textContent(): Promise<string> {
    return (await this.host()).text();
  }

  /**
   * Dismisses the token.
   */
  public async dismiss(): Promise<void> {
    return (await this.#getDismissButton()).click();
  }
}
