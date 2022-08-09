import { ComponentHarness } from '@angular/cdk/testing';

import { SkyAutocompleteSearchResultHarnessFilters } from '../autocomplete/autocomplete-search-result-filters';
import { SkyAutocompleteHarness } from '../autocomplete/autocomplete.harness';

interface SkyLookupHarnessOption {
  textContent: string;
}

export class SkyLookupHarness extends ComponentHarness {
  public static hostSelector = '.sky-input-box__lookup';

  // #documentRootLocator = this.documentRootLocatorFactory();

  #getAutocompleteHarness = this.locatorFor(SkyAutocompleteHarness);

  public async blur(): Promise<void> {
    return (await this.#getAutocompleteHarness()).blur();
  }

  public async clear(): Promise<void> {
    (await this.#getAutocompleteHarness()).clear();
  }

  public async enterText(value: string): Promise<void> {
    (await this.#getAutocompleteHarness()).enterText(value);
  }

  public async focus(): Promise<void> {
    return (await this.#getAutocompleteHarness()).focus();
  }

  public async getOptions(): Promise<SkyLookupHarnessOption[] | undefined> {
    return (await this.#getAutocompleteHarness()).getOptions();
  }

  public async selectOption(
    filters: SkyAutocompleteSearchResultHarnessFilters
  ): Promise<void> {
    return (await this.#getAutocompleteHarness()).selectOption(filters);
  }

  public async getValue(): Promise<string> {
    return (await this.#getAutocompleteHarness()).getValue();
  }

  public async isDisabled(): Promise<boolean> {
    return (await this.#getAutocompleteHarness()).isDisabled();
  }

  public async isOpen(): Promise<boolean> {
    return (await this.#getAutocompleteHarness()).isOpen();
  }

  public async isFocused(): Promise<boolean> {
    return (await this.#getAutocompleteHarness()).isFocused();
  }

  // Click show all
  // Click new button
  // Enter text and search in modal
  // Select one result in modal
  // Select multiple results in modal
  // Click cancel in modal
  // Get token values
}
