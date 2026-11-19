import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyButtonHarness } from '@skyux/forms/testing';

import { SkyCodeBlockHarnessFilters } from './code-block-harness-filters';

/**
 * Harness for interacting with a code block component in tests.
 * @preview
 */
export class SkyCodeBlockHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-code-block';

  #getCode = this.locatorFor('.sky-code-block-output code');
  #getCopyButton = this.locatorForOptional(SkyButtonHarness);
  #getFileName = this.locatorForOptional('.sky-code-block-file-name');
  #getLanguageName = this.locatorForOptional('.sky-code-block-language');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyCodeBlockHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyCodeBlockHarnessFilters,
  ): HarnessPredicate<SkyCodeBlockHarness> {
    return SkyCodeBlockHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the button that copies the code.
   */
  public async clickCopyButton(): Promise<void> {
    const button = await this.#getCopyButton();

    if (!button) {
      throw new Error(
        'The code cannot be copied because the copy button is hidden.',
      );
    }

    await button.click();
  }

  /**
   * Gets the code as displayed, without its syntax highlighting.
   */
  public async getCode(): Promise<string> {
    return await (await this.#getCode()).text();
  }

  /**
   * Gets the file name displayed in the header, or `undefined` when none is
   * displayed.
   */
  public async getFileName(): Promise<string | undefined> {
    return await (await this.#getFileName())?.text();
  }

  /**
   * Gets the name of the code's language displayed in the header, or
   * `undefined` when none is displayed.
   */
  public async getLanguageName(): Promise<string | undefined> {
    return await (await this.#getLanguageName())?.text();
  }
}
