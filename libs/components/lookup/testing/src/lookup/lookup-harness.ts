import { HarnessPredicate } from '@angular/cdk/testing';

import { SkyAutocompleteHarness } from '../autocomplete/autocomplete-harness';

import { SkyLookupHarnessFilters } from './lookup-harness-filters';
import { SkyLookupSelectionHarness } from './lookup-selection-harness';
import { SkyLookupSelectionsListHarness } from './lookup-selections-list-harness';
import { SkyLookupShowMorePickerHarness } from './lookup-show-more-picker-harness';

export class SkyLookupHarness extends SkyAutocompleteHarness {
  public static hostSelector = 'sky-lookup,.sky-input-box';

  #documentRootLocator = this.documentRootLocatorFactory();

  #getAutocompleteHarness = this.locatorFor(SkyAutocompleteHarness);

  #getSelectionsListHarness = this.locatorFor(SkyLookupSelectionsListHarness);

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

  public async dismissAllSelections(): Promise<void> {
    return (await this.#getSelectionsListHarness()).dismissAllSelections();
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
    return (await this.#getSelectionsListHarness()).getSelections();
  }

  public async getSelectionsText(): Promise<string[]> {
    return (await this.#getSelectionsListHarness()).getSelectionsText();
  }

  public async isMulti(): Promise<boolean> {
    return !(await this.locatorForOptional('.sky-lookup.sky-lookup-single')());
  }
}
