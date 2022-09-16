import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkySearchHarnessFilters } from './search-harness-filters';

/**
 * Harness for interacting with an search component in tests.
 * @internal
 */
export class SkySearchHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-search';

  #getInput = this.locatorFor('input.sky-search-input');

  #getSubmitButton = this.locatorFor('button.sky-search-btn-apply');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkySearchHarness` that meets certain criteria.
   */
  public static with(
    filters: SkySearchHarnessFilters
  ): HarnessPredicate<SkySearchHarness> {
    return this.getDataSkyIdPredicate(filters);
  }

  /**
   * Blurs the input.
   */
  public async blur(): Promise<void> {
    await (await this.#getInput()).blur();
  }

  /**
   * Clears the input.
   */
  public async clear(): Promise<void> {
    const input = await this.#getInput();
    await input.focus();
    await input.clear();
    await this.#clickSubmitButton();
  }

  /**
   * Enters text into the input and performs a search.
   */
  public async enterText(value: string): Promise<void> {
    const input = await this.#getInput();
    await input.clear();
    await input.focus();
    await input.sendKeys(value);
    await this.#clickSubmitButton();
  }

  /**
   * Focuses the input.
   */
  public async focus(): Promise<void> {
    await (await this.#getInput()).focus();
  }

  /**
   * Gets the value of the input's placeholder attribute.
   */
  public async getPlaceholderText(): Promise<string | null> {
    return (await this.#getInput()).getAttribute('placeholder');
  }

  /**
   * Gets the value of the input.
   */
  public async getValue(): Promise<string> {
    return (await this.#getInput()).getProperty('value');
  }

  /**
   * Whether the input is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    const disabled = await (await this.#getInput()).getAttribute('disabled');
    return disabled !== null;
  }

  /**
   * Whether the input is focused.
   */
  public async isFocused(): Promise<boolean> {
    return (await this.#getInput()).isFocused();
  }

  async #clickSubmitButton() {
    return (await this.#getSubmitButton()).click();
  }
}
