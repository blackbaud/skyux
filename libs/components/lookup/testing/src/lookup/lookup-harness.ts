import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyTokensHarness } from '@skyux/indicators/testing';

import { SkyAutocompleteHarness } from '../autocomplete/autocomplete-harness';

import { SkyLookupHarnessFilters } from './lookup-harness-filters';
import { SkyLookupShowMorePickerHarness } from './lookup-show-more-picker-harness';

export class SkyLookupHarness extends SkyAutocompleteHarness {
  public static hostSelector = 'sky-lookup,.sky-input-box';

  #getAutocompleteHarness = this.locatorFor(SkyAutocompleteHarness);

  #getTokensHarness = this.locatorFor(SkyTokensHarness);

  #documentRootLocator = this.documentRootLocatorFactory();

  public static with(
    filters: SkyLookupHarnessFilters
  ): HarnessPredicate<SkyLookupHarness> {
    return SkyLookupHarness.getDataSkyIdPredicate(filters);
  }

  public async isMulti(): Promise<boolean> {
    return !(await this.locatorForOptional('.sky-lookup.sky-lookup-single')());
  }

  public async openShowMorePicker(): Promise<void> {
    await this.focus();
    await this.clickShowMoreButton();
  }

  public async getShowMorePicker(): Promise<SkyLookupShowMorePickerHarness> {
    const pickerId = await (
      await (await this.#getAutocompleteHarness()).host()
    ).getAttribute('data-sky-lookup-show-more-picker-id');

    const defaultPicker = await this.#documentRootLocator.locatorForOptional(
      SkyLookupShowMorePickerHarness.with({ selector: `#${pickerId}` })
    )();

    if (!defaultPicker) {
      throw new Error('The show more picker could not be found.');
    }

    return defaultPicker;
  }

  // ?
  // public async getSelections(): Promise<SkyLookupSelectionHarness> {}

  public async getTokensList(): Promise<SkyTokensHarness> {
    return this.#getTokensHarness();
  }
}
