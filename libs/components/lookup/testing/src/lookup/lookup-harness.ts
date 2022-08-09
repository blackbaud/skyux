import { ComponentHarness } from '@angular/cdk/testing';

import { SkyAutocompleteHarness } from '../autocomplete/autocomplete-harness';
import { SkyAutocompleteInputHarness } from '../autocomplete/autocomplete-input-harness';
import { SkyAutocompleteSearchResultHarnessFilters } from '../autocomplete/autocomplete-search-result-filters';

import { SkyLookupShowMorePickerHarness } from './lookup-show-more-picker-harness';

interface SkyLookupHarnessOption {
  textContent: string;
}

export class SkyLookupHarness extends ComponentHarness {
  public static hostSelector = '.sky-input-box__lookup';

  #documentRootLocator = this.documentRootLocatorFactory();

  #getInputHarness = this.locatorFor(SkyAutocompleteInputHarness);

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

  public async clickShowMoreButton(): Promise<void> {
    return (await this.#getAutocompleteHarness()).clickShowMoreButton();
  }

  public async clickAddButton(): Promise<void> {
    return (await this.#getAutocompleteHarness()).clickAddButton();
  }

  public async getShowMorePicker(): Promise<SkyLookupShowMorePickerHarness> {
    const pickerId = await (
      await (await this.#getInputHarness()).host()
    ).getAttribute('data-sky-lookup-show-more-picker-id');

    const defaultPicker = await this.#documentRootLocator.locatorFor(
      SkyLookupShowMorePickerHarness.with({ selector: `#${pickerId}` })
    )();

    return defaultPicker;
  }

  // TODO: Get token values
}
