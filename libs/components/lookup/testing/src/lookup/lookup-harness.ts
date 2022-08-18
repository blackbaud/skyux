import { HarnessPredicate } from '@angular/cdk/testing';

import { SkyAutocompleteHarness } from '../autocomplete/autocomplete-harness';

import { SkyLookupHarnessFilters } from './lookup-harness-filters';
import { SkyLookupSelectionHarness } from './lookup-selection-harness';
import { SkyLookupShowMorePickerHarness } from './lookup-show-more-picker-harness';

export class SkyLookupHarness extends SkyAutocompleteHarness {
  public static hostSelector = 'sky-lookup,.sky-input-box';

  #getAutocompleteHarness = this.locatorFor(SkyAutocompleteHarness);

  #getSelectionHarnesses = this.locatorForAll(SkyLookupSelectionHarness);

  #documentRootLocator = this.documentRootLocatorFactory();

  public static with(
    filters: SkyLookupHarnessFilters
  ): HarnessPredicate<SkyLookupHarness> {
    return SkyLookupHarness.getDataSkyIdPredicate(filters);
  }

  public async clickAddButton(): Promise<void> {
    await this.focus();
    await super.clickAddButton();
  }

  public async clickShowMoreButton(): Promise<void> {
    await this.focus();
    await super.clickShowMoreButton();
  }

  public async getShowMorePicker(): Promise<SkyLookupShowMorePickerHarness> {
    const pickerId = await (
      await (await this.#getAutocompleteHarness()).host()
    ).getAttribute('data-sky-lookup-show-more-picker-id');

    const defaultPicker = await this.#documentRootLocator.locatorForOptional(
      SkyLookupShowMorePickerHarness.with({ selector: `#${pickerId}` })
    )();

    if (!defaultPicker) {
      throw new Error(
        'Cannot get the "Show more" picker because it is not open.'
      );
    }

    return defaultPicker;
  }

  public async getSelections(): Promise<SkyLookupSelectionHarness[]> {
    const selections = await this.#getSelectionHarnesses();

    return selections;
  }

  public async getSelectionsText(): Promise<string[]> {
    const selections = await this.getSelections();

    const text = [];
    for (const selection of selections) {
      text.push(await selection.textContent());
    }

    return text;
  }

  public async dismissAllSelections(): Promise<void> {
    const selections = await this.getSelections();
    for (const selection of selections) {
      await selection.dismiss();
    }
  }

  public async isMulti(): Promise<boolean> {
    return !(await this.locatorForOptional('.sky-lookup.sky-lookup-single')());
  }
}
