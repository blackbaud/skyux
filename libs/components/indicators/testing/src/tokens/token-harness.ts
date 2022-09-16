import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

import { SkyTokenHarnessFilters } from './token-harness-filters';

/**
 * Harness for interacting with a token component in tests.
 * @internal
 */
export class SkyTokenHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-token';

  #getDismissButton = this.locatorFor('button.sky-token-btn-close');

  #getWrapper = this.locatorFor('.sky-token');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyTokenHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyTokenHarnessFilters
  ): HarnessPredicate<SkyTokenHarness> {
    return new HarnessPredicate(this, filters).addOption(
      'text',
      filters.text,
      async (harness, test) =>
        HarnessPredicate.stringMatches(
          await (await harness.host()).text(),
          test
        )
    );
  }

  /**
   * Dismisses the token.
   */
  public async dismiss(): Promise<void> {
    if (!(await this.isDismissible())) {
      throw new Error(
        'Could not dismiss the token because it is not dismissable.'
      );
    }

    await (await this.#getDismissButton()).click();
  }

  /**
   * Returns the text content of the token.
   */
  public async getText(): Promise<string> {
    return (await this.host()).text();
  }

  /**
   * Whether the token is dismissible.
   */
  public async isDismissible(): Promise<boolean> {
    return await (await this.#getWrapper()).hasClass('sky-token-dismissable');
  }
}
