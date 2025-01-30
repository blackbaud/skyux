import { HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyErrorType } from '@skyux/errors';

import { SkyErrorHarnessFilters } from './error-harness-filters';

/**
 * Harness for interacting with an error component in tests.
 */
export class SkyErrorHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-error';

  #actionButton = this.locatorForOptional('sky-error-action button');
  #description = this.locatorFor('.sky-error-description');
  #imageContainer = this.locatorForOptional('.sky-error-image-container');
  #title = this.locatorFor('.sky-error-title');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyErrorHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyErrorHarnessFilters,
  ): HarnessPredicate<SkyErrorHarness> {
    return SkyErrorHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the action button in the error action.
   */
  public async clickActionButton(): Promise<void> {
    await (await this.#getAction()).click();
  }

  /**
   * Gets the text of the action button in the error action.
   */
  public async getActionButtonText(): Promise<string> {
    return await (await this.#getAction()).text();
  }

  /**
   * Gets the description of the error.
   */
  public async getDescription(): Promise<string> {
    return await (await this.#description()).text();
  }

  public async getErrorType(): Promise<SkyErrorType | undefined> {
    return ((await (await this.host()).getAttribute('errorType')) ??
      undefined) as SkyErrorType | undefined;
  }

  /**
   * Gets the title of the error.
   */
  public async getTitle(): Promise<string> {
    return await (await this.#title()).text();
  }

  /**
   * Whether the error displays an image.
   */
  public async hasImage(): Promise<boolean> {
    return !!(await this.#imageContainer());
  }

  async #getAction(): Promise<TestElement> {
    const action = await this.#actionButton();

    if (action === null) {
      throw Error('Unable to find error action button.');
    }

    return action;
  }
}
