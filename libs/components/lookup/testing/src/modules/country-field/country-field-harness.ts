import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyOverlayHarness } from '@skyux/core/testing';

import { SkyAutocompleteHarness } from '../autocomplete/autocomplete-harness';
import { SkyAutocompleteInputHarness } from '../autocomplete/autocomplete-input-harness';

import { SkyCountryFieldHarnessFilters } from './country-field-harness-filters';
import { SkyCountryFieldSearchResultHarness } from './country-field-search-result-harness';
import { SkyCountryFieldSearchResultHarnessFilters } from './country-field-search-result-harness-filters';

/**
 * Harness for interacting with a country field component in tests.
 */
export class SkyCountryFieldHarness extends SkyAutocompleteHarness {
  /**
   * Finds a standard country field component, or a country field component that is wrapped by an input box component.
   * For input box implementations, we need to use the `.sky-input-box` selector since the `sky-country-field`
   * element is removed from the DOM.
   * @internal
   */
  public static override hostSelector =
    'sky-country-field,.sky-country-field-container';

  #documentRootLocator = this.documentRootLocatorFactory();

  #getInput = this.locatorFor(SkyAutocompleteInputHarness);

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyCountryFieldHarness` that meets certain criteria.
   * These filters only work for standalone country fields.
   * For country fields wrapped inside `sky-input-box`, place filters
   * on the input box instead, and query the country field using a `SkyInputBoxHarness`.
   * For the input box implementation, see the code example.
   */
  public static override with(
    filters: SkyCountryFieldHarnessFilters,
  ): HarnessPredicate<SkyCountryFieldHarness> {
    return SkyCountryFieldHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Blurs the country field input.
   * @deprecated Call `await (await countryField.getControl()).blur()` instead.
   */
  public override async blur(): Promise<void> {
    return await (await super.getControl()).blur();
  }

  /**
   * Clears the country field input value.
   * @deprecated Call `await (await countryField.getControl()).clear()` instead.
   */
  public override async clear(): Promise<void> {
    return await (await super.getControl()).clear();
  }

  /**
   * Enters text into the country field input.
   * @deprecated Call `await (await countryField.getControl()).setValue()` instead.
   */
  public override async enterText(value: string): Promise<void> {
    return await (await super.getControl()).setValue(value);
  }

  /**
   * Focuses the country field input.
   * @deprecated Call `await (await countryField.getControl()).focus()` instead.
   */
  public override async focus(): Promise<void> {
    return await (await super.getControl()).focus();
  }

  /**
   * Gets the country field  `aria-labelledby` value.
   * This is not needed for country field because the id is generated internally,
   * and the method is marked internal to prevent it from being documented publicly.
   * @internal
   */
  /* istanbul ignore next */
  public override async getAriaLabelledby(): Promise<string | null> {
    return await super.getAriaLabelledby();
  }

  /**
   * Returns country field search result harnesses.
   */
  public override async getSearchResults(
    filters?: SkyCountryFieldSearchResultHarnessFilters,
  ): Promise<SkyCountryFieldSearchResultHarness[]> {
    const overlay = await this.#getOverlay();

    if (!overlay) {
      throw new Error(
        'Unable to retrieve search results. The country field is closed.',
      );
    }

    const harnesses = await overlay.queryHarnesses(
      SkyCountryFieldSearchResultHarness.with(filters || {}),
    );

    if (filters && harnesses.length === 0) {
      // Stringify the regular expression so that it's readable in the console log.
      if (filters.text instanceof RegExp) {
        filters.text = filters.text.toString();
      }

      throw new Error(
        `Could not find search results matching filter(s): ${JSON.stringify(
          filters,
        )}`,
      );
    }

    return harnesses;
  }

  /**
   * Returns the text content for each country field search result.
   */
  public override async getSearchResultsText(
    filters?: SkyCountryFieldSearchResultHarnessFilters,
  ): Promise<string[]> {
    const harnesses = await this.getSearchResults(filters);

    const text: string[] = [];
    for (const harness of harnesses) {
      text.push(await harness.getText());
    }

    return text;
  }

  /**
   * Gets the value of the country field input.
   * @deprecated Call `await (await countryField.getControl()).getValue()` instead.
   */
  public override async getValue(): Promise<string> {
    return await (await super.getControl()).getValue();
  }

  /**
   * Gets the text displayed when no search results are found.
   * For a country field, this is always the default text and the method
   * is marked internal to prevent it from being documented publicly.
   * @internal
   */
  /* istanbul ignore next */
  public override async getNoResultsFoundText(): Promise<string> {
    return await super.getNoResultsFoundText();
  }

  /**
   * Whether the country field input is disabled.
   * @deprecated Call `await (await countryField.getControl()).isDisabled()` instead.
   */
  public override async isDisabled(): Promise<boolean> {
    return await (await super.getControl()).isDisabled();
  }

  /**
   * Whether the country field input is focused.
   * @deprecated Call `await (await countryField.getControl()).isFocused()` instead.
   */
  public override async isFocused(): Promise<boolean> {
    return await (await super.getControl()).isFocused();
  }

  /**
   * Whether the country field is open.
   */
  public override async isOpen(): Promise<boolean> {
    return await super.isOpen();
  }

  /**
   * Selects a search result.
   */
  public override async selectSearchResult(
    filters: SkyCountryFieldSearchResultHarnessFilters,
  ): Promise<void> {
    return await super.selectSearchResult(filters);
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
