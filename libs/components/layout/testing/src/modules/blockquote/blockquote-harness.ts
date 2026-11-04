import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyBlockquoteHarnessFilters } from './blockquote-harness-filters';

/**
 * Harness for interacting with a blockquote component in tests.
 * @preview
 */
export class SkyBlockquoteHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-blockquote';

  #getAuthor = this.locatorForOptional('.sky-blockquote-author');
  #getSourceLink = this.locatorForOptional(
    '.sky-blockquote-attribution a.sky-blockquote-source-link',
  );
  #getText = this.locatorFor('.sky-blockquote-text');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyBlockquoteHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyBlockquoteHarnessFilters,
  ): HarnessPredicate<SkyBlockquoteHarness> {
    return SkyBlockquoteHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the name the quotation is attributed to, or `undefined` when `author`
   * isn't set.
   */
  public async getAuthor(): Promise<string | undefined> {
    return (await (await this.#getAuthor())?.text())?.trim();
  }

  /**
   * Gets the URL of the quotation's source, or `undefined` when it isn't set.
   */
  public async getQuoteSource(): Promise<string | undefined> {
    return (
      (await (await this.#getSourceLink())?.getAttribute('href')) ?? undefined
    );
  }

  /**
   * Gets the text of the quotation.
   */
  public async getText(): Promise<string> {
    return (await (await this.#getText()).text()).trim();
  }
}
