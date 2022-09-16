import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness, SkyOverlayHarness } from '@skyux/core/testing';

import { SkyAutocompleteHarnessFilters } from './autocomplete-harness-filters';
import { SkyAutocompleteInputHarness } from './autocomplete-input-harness';
import { SkyAutocompleteSearchResultHarness } from './autocomplete-search-result-harness';
import { SkyAutocompleteSearchResultHarnessFilters } from './autocomplete-search-result-harness-filters';

/**
 * Harness for interacting with an autocomplete component in tests.
 * @internal
 */
export class SkyAutocompleteHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-autocomplete';

  #documentRootLocator = this.documentRootLocatorFactory();

  #getInput = this.locatorFor(SkyAutocompleteInputHarness);

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyAutocompleteHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyAutocompleteHarnessFilters
  ): HarnessPredicate<SkyAutocompleteHarness> {
    return SkyAutocompleteHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Blurs the autocomplete input.
   */
  public async blur(): Promise<void> {
    return (await this.#getInput()).blur();
  }

  /**
   * Clears the input value.
   */
  public async clear(): Promise<void> {
    return (await this.#getInput()).clear();
  }

  /**
   * Enters text into the autocomplete input.
   */
  public async enterText(value: string): Promise<void> {
    return (await this.#getInput()).enterText(value);
  }

  /**
   * Focuses the autocomplete input.
   */
  public async focus(): Promise<void> {
    return (await this.#getInput()).focus();
  }

  /**
   * Returns search result harnesses.
   */
  public async getSearchResults(
    filters?: SkyAutocompleteSearchResultHarnessFilters
  ): Promise<SkyAutocompleteSearchResultHarness[]> {
    const overlay = await this.#getOverlay();

    if (!overlay) {
      throw new Error(
        'Unable to retrieve search results. The autocomplete is closed.'
      );
    }

    const harnesses = await overlay.queryHarnesses(
      SkyAutocompleteSearchResultHarness.with(filters || {})
    );

    if (filters && harnesses.length === 0) {
      // Stringify the regular expression so that it's readable in the console log.
      if (filters.text instanceof RegExp) {
        filters.text = filters.text.toString();
      }

      throw new Error(
        `Could not find search results matching filter(s): ${JSON.stringify(
          filters
        )}`
      );
    }

    return harnesses;
  }

  /**
   * Returns the text content for each search result.
   */
  public async getSearchResultsText(
    filters?: SkyAutocompleteSearchResultHarnessFilters
  ): Promise<string[]> {
    const harnesses = await this.getSearchResults(filters);

    const text: string[] = [];
    for (const harness of harnesses) {
      text.push(await harness.getText());
    }

    return text;
  }

  /**
   * Gets the value of the autocomplete input.
   */
  public async getValue(): Promise<string> {
    return (await this.#getInput()).getValue();
  }

  /**
   * Whether the autocomplete input is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    return (await this.#getInput()).isDisabled();
  }

  /**
   * Whether the autocomplete input is focused.
   */
  public async isFocused(): Promise<boolean> {
    return (await this.#getInput()).isFocused();
  }

  /**
   * Whether the autocomplete is open.
   */
  public async isOpen(): Promise<boolean> {
    const overlay = await this.#getOverlay();
    return !!overlay;
  }

  /**
   * Selects a search result.
   */
  public async selectSearchResult(
    filters: SkyAutocompleteSearchResultHarnessFilters
  ): Promise<void> {
    const results = await this.getSearchResults(filters);
    if (results && results.length > 0) {
      await results[0].select();
    }
  }

  /**
   * Clicks the "Add" button in the autocomplete search results panel.
   * (The "Add" functionality is not included in the public API
   * of a "vanilla" autocomplete component, so this method is protected
   * to prevent consumers of the autocomplete harness from calling it.
   * The lookup harness, which extends the autocomplete harness, may
   * still access this feature, however.)
   */
  protected async clickAddButton(): Promise<void> {
    const overlay = await this.#getOverlay();
    if (!overlay) {
      throw new Error(
        'Unable to find the "Add" button. The autocomplete is closed.'
      );
    }

    const button = await overlay.querySelector(
      'button.sky-autocomplete-action-add'
    );

    if (!button) {
      throw new Error(
        'The "Add" button cannot be clicked because it does not exist.'
      );
    }

    await button.click();
  }

  /**
   * Clicks the "Show more" button.
   * (The "Show more" functionality is not included in the public API
   * of a "vanilla" autocomplete component, so this method is protected
   * to prevent consumers of the autocomplete harness from calling it.
   * The lookup harness, which extends the autocomplete harness, may
   * still access this feature, however.)
   */
  protected async clickShowMoreButton(): Promise<void> {
    const overlay = await this.#getOverlay();

    if (!overlay) {
      throw new Error(
        'Unable to find the "Show more" button. ' +
          'The autocomplete is closed.'
      );
    }

    const button = await overlay.querySelector(
      'button.sky-autocomplete-action-more'
    );

    if (!button) {
      throw new Error(
        'The "Show more" button cannot be clicked because it does not exist.'
      );
    }

    await button.click();
  }

  async #getOverlay(): Promise<SkyOverlayHarness | null> {
    const overlayId = await (await this.#getInput()).getAriaOwns();

    return overlayId
      ? this.#documentRootLocator.locatorForOptional(
          SkyOverlayHarness.with({ selector: `#${overlayId}` })
        )()
      : null;
  }
}
