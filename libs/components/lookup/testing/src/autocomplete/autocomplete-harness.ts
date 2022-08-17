import { HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { SkyComponentHarness, SkyOverlayHarness } from '@skyux/core/testing';

import { SkyAutocompleteHarnessFilters } from './autocomplete-harness-filters';
import { SkyAutocompleteHarnessSearchResult } from './autocomplete-harness-search-result';
import { SkyAutocompleteInputHarness } from './autocomplete-input-harness';
import { SkyAutocompleteSearchResultHarness } from './autocomplete-search-result-harness';
import { SkyAutocompleteSearchResultHarnessFilters } from './autocomplete-search-result-harness-filters';

export class SkyAutocompleteHarness extends SkyComponentHarness {
  public static hostSelector = 'sky-autocomplete';

  #documentRootLocator = this.documentRootLocatorFactory();

  #getInputHarness = this.locatorFor(SkyAutocompleteInputHarness);

  public static with(
    filters: SkyAutocompleteHarnessFilters
  ): HarnessPredicate<SkyAutocompleteHarness> {
    return SkyAutocompleteHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Blurs the autocomplete input.
   */
  public async blur(): Promise<void> {
    return (await this.#getInputEl()).blur();
  }

  /**
   * Clears the input value.
   */
  public async clear(): Promise<void> {
    return (await this.#getInputEl()).clear();
  }

  /**
   * Enters text into the autocomplete input.
   */
  public async enterText(value: string): Promise<void> {
    const el = await this.#getInputEl();
    await el.focus();
    await el.clear();
    await el.sendKeys(value);
  }

  /**
   * Focuses the autocomplete input.
   */
  public async focus(): Promise<void> {
    return (await this.#getInputEl()).focus();
  }

  /**
   * Gets the search results from the autocomplete dropdown.
   */
  public async getSearchResults(): Promise<
    SkyAutocompleteHarnessSearchResult[] | undefined
  > {
    const harnesses = await this.#getSearchResultHarnesses();
    if (harnesses) {
      const results: SkyAutocompleteHarnessSearchResult[] = [];

      for (const harness of harnesses) {
        const harnessTestElement = await harness.host();
        const option: SkyAutocompleteHarnessSearchResult = {
          textContent: await harnessTestElement.text(),
        };

        if (await harness.hasCustomTemplate()) {
          option.testElement = harnessTestElement;
        }

        results.push(option);
      }

      return results;
    }

    return;
  }

  /**
   * Gets the value of the autocomplete input.
   */
  public async getValue(): Promise<string> {
    return (await this.#getInputEl()).getProperty('value');
  }

  /**
   * Whether the autocomplete input is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    const disabled = await (await this.#getInputEl()).getAttribute('disabled');
    return disabled !== null;
  }

  /**
   * Whether the autocomplete input is focused.
   */
  public async isFocused(): Promise<boolean> {
    return (await this.#getInputEl()).isFocused();
  }

  /**
   * Whether the autocomplete is open.
   */
  public async isOpen(): Promise<boolean> {
    const overlay = await this.#getOverlay();
    return !!overlay;
  }

  /**
   * Selects a search result from the autocomplete dropdown.
   */
  public async selectSearchResult(
    filters: SkyAutocompleteSearchResultHarnessFilters
  ): Promise<void> {
    const resultHarnesses = await this.#getSearchResultHarnesses(filters);
    if (resultHarnesses && resultHarnesses.length > 0) {
      await resultHarnesses[0].select();
    }
  }

  /**
   * Clicks the "Add" button in the autocomplete dropdown.
   */
  // (This method is protected to prevent consumers of the autocomplete harness from calling it.)
  protected async clickAddButton(): Promise<void> {
    const overlay = await this.#getOverlay();
    if (!overlay) {
      throw new Error(
        'Unable to find the add button. The autocomplete is closed.'
      );
    }

    const button = await overlay.querySelector(
      'button.sky-autocomplete-action-add'
    );

    if (!button) {
      throw new Error(
        'The add button cannot be clicked because it does not exist.'
      );
    }

    await button.click();
  }

  /**
   * Clicks the "Show all" button in the autocomplete dropdown.
   */
  // (This method is protected to prevent consumers of the autocomplete harness from calling it.)
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

  async #getInputEl(): Promise<TestElement> {
    return (await this.#getInputHarness()).host();
  }

  async #getOverlay(): Promise<SkyOverlayHarness | null> {
    const overlayId = await (
      await this.#getInputEl()
    ).getAttribute('aria-owns');

    return overlayId
      ? this.#documentRootLocator.locatorForOptional(
          SkyOverlayHarness.with({ selector: `#${overlayId}` })
        )()
      : null;
  }

  async #getSearchResultHarnesses(
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

    if (!harnesses || harnesses.length === 0) {
      throw new Error(
        `Could not find search results matching filter(s): ${JSON.stringify(
          filters
        )}`
      );
    }

    return harnesses;
  }
}
