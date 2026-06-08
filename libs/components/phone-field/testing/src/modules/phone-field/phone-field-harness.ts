import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyCountryFieldHarness } from '@skyux/lookup/testing';

import { SkyPhoneFieldHarnessFilters } from './phone-field-harness-filters';
import { SkyPhoneFieldInputHarness } from './phone-field-input-harness';

/**
 * Harness for interacting with a phone field component in tests.
 */
export class SkyPhoneFieldHarness extends SkyComponentHarness {
  /**
   * Finds a standard phone field component, or a phone field component that is wrapped by an input box component.
   * For input box implementations, we need to use the `.sky-input-box` selector since the `sky-country-field`
   * element is removed from the DOM.
   * @internal
   */
  public static hostSelector = 'sky-phone-field,.sky-input-box';

  #getCountryField = this.locatorForOptional(SkyCountryFieldHarness);
  #getCountryFieldButton = this.locatorFor(
    '.sky-phone-field-country-btn button',
  );
  #getCountryFieldButtonContainer = this.locatorFor(
    '.sky-phone-field-country-btn',
  );
  #getInput = this.locatorFor(SkyPhoneFieldInputHarness);

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyPhoneFieldHarness` that meets certain criteria.
   *
   * These filters only work for standalone phone fields. For phone fields
   * wrapped inside `sky-input-box`, place filters on the input box
   * instead and query the datepicker using a `SkyInputBoxHarness`.
   * For the input box implementation, see the code example.
   */
  public static with(
    filters: SkyPhoneFieldHarnessFilters,
  ): HarnessPredicate<SkyPhoneFieldHarness> {
    return SkyPhoneFieldHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the phone field input harness.
   */
  public async getControl(): Promise<SkyPhoneFieldInputHarness> {
    return await this.#getInput();
  }

  /**
   * Returns the selected country iso2 code.
   */
  public async getSelectedCountryIso2(): Promise<string | null> {
    return await (
      await this.#getCountryFieldButtonContainer()
    ).getAttribute('data-sky-test-iso2');
  }

  /**
   * Returns the selected country name.
   */
  public async getSelectedCountryName(): Promise<string | null> {
    return await (
      await this.#getCountryFieldButtonContainer()
    ).getAttribute('data-sky-test-name');
  }

  /**
   * Opens the country selector, performs a search, but makes no selection.
   * @param searchText The name of the country to select.
   * @returns The list of country names matching the search text.
   */
  public async searchCountry(searchText: string): Promise<string[]> {
    const countryField = await this.#openCountrySelectionAndSearch(searchText);

    return await countryField.getSearchResultsText();
  }

  /**
   * Opens the country selector, performs a search, and selects the first result (if any).
   * @param searchText The name of the country to select.
   */
  public async selectCountry(searchText: string): Promise<void> {
    const countryField = await this.#openCountrySelectionAndSearch(searchText);

    await countryField.selectSearchResult({});
  }

  async #openCountrySelectionAndSearch(
    searchText: string,
  ): Promise<SkyCountryFieldHarness> {
    const button = await this.#getCountryFieldButton();

    // Focus the button before clicking to move focus away from the phone input.
    // Without this, the phone input remains focused when the component toggles
    // to the country search view, and Angular's @if removal of the focused
    // input fires a blur event during change detection, causing an
    // ExpressionChangedAfterItHasBeenCheckedError. In a real browser, clicking
    // the button naturally moves focus, so this aligns test behavior with
    // actual user interaction.
    await button.focus();
    await button.click();

    const countryField = await this.#getCountryField();

    await countryField?.enterText(searchText);

    return countryField!;
  }
}
