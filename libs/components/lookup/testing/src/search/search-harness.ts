import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkySearchHarnessFilters } from './search-harness-filters';

/**
 * Harness for interacting with a search component in tests.
 */
export class SkySearchHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-search';

  #getInput = this.locatorFor('input.sky-search-input');

  #getClearButton = this.locatorFor('button.sky-search-btn-clear');
  #getDismissButton = this.locatorForOptional('button.sky-search-btn-dismiss');
  #getSubmitButton = this.locatorFor('button.sky-search-btn-apply');
  #getOpenButton = this.locatorFor('button.sky-search-btn-open');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkySearchHarness` that meets certain criteria.
   */
  public static with(
    filters: SkySearchHarnessFilters,
  ): HarnessPredicate<SkySearchHarness> {
    return this.getDataSkyIdPredicate(filters);
  }

  /**
   * Blurs the search input.
   */
  public async blur(): Promise<void> {
    await this.#assertIsExpanded('Failed to blur the search input.');

    await (await this.#getInput()).blur();
  }

  /**
   * Clears the search input.
   */
  public async clear(): Promise<void> {
    await this.#assertIsExpanded('Failed to clear the search input.');

    const input = await this.#getInput();
    await input.focus();
    await input.clear();
    await this.clickSubmitButton();
  }

  /**
   * Clicks the search input clear button.
   */
  public async clickClearButton(): Promise<void> {
    await this.#assertIsExpanded('Failed to click clear button.');
    await (await this.#getClearButton()).click();
  }

  /**
   * Clicks search dismiss button to collapse search back to a button.
   */
  public async clickDismissSearchButton(): Promise<void> {
    const button = await this.#getDismissButton();

    if (!button) {
      throw new Error(
        'Cannot find dismiss search button. Is a collapsed search open?',
      );
    }

    await button.click();
  }

  /**
   * Clicks the search icon button that opens search input when it is collapsed.
   */
  public async clickOpenSearchButton(): Promise<void> {
    const button = await this.#getOpenButton();

    if (!(await this.isCollapsed())) {
      throw new Error(
        'Cannot click search open button as search is not collapsed',
      );
    }

    await button.click();
  }

  /**
   * Clicks the search submit button.
   */
  public async clickSubmitButton(): Promise<void> {
    await this.#assertIsExpanded('Failed to click the submit button.');
    await (await this.#getSubmitButton()).click();
  }

  /**
   * Enters text into the search input and performs a search.
   */
  public async enterText(value: string): Promise<void> {
    await this.#assertIsExpanded('Failed to enter text into the search input.');

    const input = await this.#getInput();
    await input.clear();
    await input.focus();
    await input.sendKeys(value);
    await this.clickSubmitButton();
  }

  /**
   * Focuses the search input.
   */
  public async focus(): Promise<void> {
    await this.#assertIsExpanded('Failed to focus the search input.');

    await (await this.#getInput()).focus();
  }

  /**
   * Gets the search input's `aria-label`.
   */
  public async getAriaLabel(): Promise<string | null> {
    return await (await this.#getInput()).getAttribute('aria-label');
  }

  /**
   * Gets the search's aria-labelledby.
   */
  public async getAriaLabelledby(): Promise<string | null> {
    return await (await this.#getInput()).getAttribute('aria-labelledby');
  }

  /**
   * Gets the value of the input's placeholder attribute.
   */
  public async getPlaceholderText(): Promise<string | null> {
    await this.#assertIsExpanded('Failed to get the placeholder text.');

    return await (await this.#getInput()).getAttribute('placeholder');
  }

  /**
   * Gets the value of the search input.
   */
  public async getValue(): Promise<string> {
    await this.#assertIsExpanded(
      'Failed to get the value of the search input.',
    );

    return await (await this.#getInput()).getProperty('value');
  }

  /**
   * Whether the search input is collapsed.
   */
  public async isCollapsed(): Promise<boolean> {
    return (
      (await (await this.#getOpenButton()).getAttribute('hidden')) === null
    );
  }

  /**
   * Whether the search input is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    const disabled = await (await this.#getInput()).getAttribute('disabled');
    return disabled !== null;
  }

  /**
   * Whether the search input is focused.
   */
  public async isFocused(): Promise<boolean> {
    await this.#assertIsExpanded(
      'Failed to get the search input focus status.',
    );

    return await (await this.#getInput()).isFocused();
  }

  async #assertIsExpanded(errorMessage: string): Promise<void> {
    if (await this.isCollapsed()) {
      throw new Error(`${errorMessage} Search is collapsed.`);
    }
  }
}
