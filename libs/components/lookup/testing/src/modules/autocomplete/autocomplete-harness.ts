import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness, SkyOverlayHarness } from '@skyux/core/testing';

import { SkyAutocompleteHarnessFilters } from './autocomplete-harness-filters';
import { SkyAutocompleteInputHarness } from './autocomplete-input-harness';
import { SkyAutocompleteSearchResultHarness } from './autocomplete-search-result-harness';
import { SkyAutocompleteSearchResultHarnessFilters } from './autocomplete-search-result-harness-filters';

/**
 * Harness for interacting with an autocomplete component in tests.
 */
export class SkyAutocompleteHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-autocomplete';

  #documentRootLocator = this.documentRootLocatorFactory();
  #getAutocomplete = this.locatorFor('.sky-autocomplete');
  #getInput = this.locatorFor(SkyAutocompleteInputHarness);

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyAutocompleteHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyAutocompleteHarnessFilters,
  ): HarnessPredicate<SkyAutocompleteHarness> {
    return SkyAutocompleteHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Blurs the autocomplete input.
   * @deprecated Call `await (await autocomplete.getControl()).blur()` instead.
   */
  public async blur(): Promise<void> {
    await (await this.#getInput()).blur();
  }

  /**
   * Clears the autocomplete input value.
   * @deprecated Call `await (await autocomplete.getControl()).clear()` instead.
   */
  public async clear(): Promise<void> {
    await (await this.#getInput()).clear();
  }

  /**
   * Enters text into the autocomplete input.
   * @deprecated Call `await (await autocomplete.getControl()).setValue()` instead.
   */
  public async enterText(value: string): Promise<void> {
    await (await this.#getInput()).setValue(value);
  }

  /**
   * Focuses the autocomplete input.
   * @deprecated Call `await (await autocomplete.getControl()).focus()` instead.
   */
  public async focus(): Promise<void> {
    await (await this.#getInput()).focus();
  }

  /**
   * Gets the autocomplete `aria-labelledby` value.
   */
  public async getAriaLabelledby(): Promise<string | null> {
    return await (
      await this.#getAutocomplete()
    ).getAttribute('aria-labelledby');
  }

  /**
   * Gets the autocomplete input harness.
   */
  public async getControl(): Promise<SkyAutocompleteInputHarness> {
    return await this.#getInput();
  }

  /**
   * Gets a specific autocomplete search result that meets certain criteria.
   */
  public async getSearchResult(
    filter: SkyAutocompleteSearchResultHarnessFilters,
  ): Promise<SkyAutocompleteSearchResultHarness> {
    const overlay = await this.#getOverlay();

    if (!overlay) {
      throw new Error(
        'Unable to retrieve search result. The autocomplete is closed.',
      );
    }

    return await overlay.queryHarness(
      SkyAutocompleteSearchResultHarness.with(filter),
    );
  }

  /**
   * Gets an array of autocomplete search results.
   */
  public async getSearchResults(
    filters?: SkyAutocompleteSearchResultHarnessFilters,
  ): Promise<SkyAutocompleteSearchResultHarness[]> {
    const overlay = await this.#getOverlay();

    if (!overlay) {
      throw new Error(
        'Unable to retrieve search results. The autocomplete is closed.',
      );
    }

    return await overlay.queryHarnesses(
      SkyAutocompleteSearchResultHarness.with(filters || {}),
    );
  }

  /**
   * Returns the text content for each autocomplete search result.
   */
  public async getSearchResultsText(
    filters?: SkyAutocompleteSearchResultHarnessFilters,
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
   * @deprecated Call `await (await autocomplete.getControl()).getValue()` instead.
   */
  public async getValue(): Promise<string> {
    return await (await this.#getInput()).getValue();
  }

  /**
   * Gets the text displayed when no search results are found.
   */
  public async getNoResultsFoundText(): Promise<string> {
    const overlay = await this.#getOverlay();

    if (!overlay) {
      throw new Error(
        'Cannot find "no results found" text as the dropdown is closed.',
      );
    }

    try {
      const noResultFoundText = await overlay.querySelector(
        '.sky-autocomplete-no-results',
      );
      return (await noResultFoundText.text()).trim();
    } catch {
      throw new Error(
        'Cannot find "no results found" text because there are search results.',
      );
    }
  }

  /**
   * Whether the autocomplete input is disabled.
   * @deprecated Call `await (await autocomplete.getControl()).isDisabled()` instead.
   */
  public async isDisabled(): Promise<boolean> {
    return await (await this.#getInput()).isDisabled();
  }

  /**
   * Whether the autocomplete input is focused.
   * @deprecated Call `await (await autocomplete.getControl()).isFocused()` instead.
   */
  public async isFocused(): Promise<boolean> {
    return await (await this.#getInput()).isFocused();
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
    filters: SkyAutocompleteSearchResultHarnessFilters,
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
   * @internal
   */
  protected async clickAddButton(): Promise<void> {
    const overlay = await this.#getOverlay();
    if (!overlay) {
      throw new Error(
        'Unable to find the "Add" button. The autocomplete is closed.',
      );
    }

    const button = await overlay.querySelectorOrNull(
      'button.sky-autocomplete-action-add',
    );

    if (!button) {
      throw new Error(
        'The "Add" button cannot be clicked because it does not exist.',
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
   * @internal
   */
  protected async clickShowMoreButton(): Promise<void> {
    const overlay = await this.#getOverlay();

    if (!overlay) {
      throw new Error(
        'Unable to find the "Show more" button. ' +
          'The autocomplete is closed.',
      );
    }

    const button = await overlay.querySelectorOrNull(
      'button.sky-autocomplete-action-more',
    );

    if (!button) {
      throw new Error(
        'The "Show more" button cannot be clicked because it does not exist.',
      );
    }

    await button.click();
  }

  async #getOverlay(): Promise<SkyOverlayHarness | null> {
    const overlayId = await (await this.#getInput()).getAriaControls();

    return overlayId
      ? await this.#documentRootLocator.locatorForOptional(
          SkyOverlayHarness.with({ selector: `#${overlayId}` }),
        )()
      : null;
  }
}
