import { HarnessPredicate } from '@angular/cdk/testing';

import { SkyAutocompleteHarness } from '../autocomplete/autocomplete-harness';

import { SkyLookupHarnessFilters } from './lookup-harness-filters';
import { SkyLookupSelectionHarness } from './lookup-selection-harness';
import { SkyLookupSelectionsListHarness } from './lookup-selections-list-harness';
import { SkyLookupShowMorePickerHarness } from './lookup-show-more-picker-harness';

/**
 * Harness for interacting with a lookup component in tests.
 */
export class SkyLookupHarness extends SkyAutocompleteHarness {
  /**
   * Finds a standard lookup component, or a lookup component that is wrapped by an input box component.
   * For input box implementations, we need to use the `.sky-input-box` selector since the `sky-lookup`
   * element is removed from the DOM.
   * @internal
   */
  public static override hostSelector = 'sky-lookup,.sky-input-box';

  #documentRootLocator = this.documentRootLocatorFactory();

  #getAutocompleteHarness = this.locatorFor(SkyAutocompleteHarness);

  #getSelectionsListHarness = this.locatorFor(SkyLookupSelectionsListHarness);

  #getWrapper = this.locatorFor('.sky-lookup');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyLookupHarness` that meets certain criteria.
   *
   * For lookup components wrapped in input boxes, all filters (eg. `data-sky-id`) must be placed on the `sky-input-box` wrapper.
   */
  public static override with(
    filters: SkyLookupHarnessFilters,
  ): HarnessPredicate<SkyLookupHarness> {
    return SkyLookupHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the "Add" button on the search results panel.
   */
  public override async clickAddButton(): Promise<void> {
    await this.focus();
    await super.clickAddButton();
  }

  /**
   * Clicks the "Show more" button on the search results panel.
   */
  public override async clickShowMoreButton(): Promise<void> {
    await this.focus();
    await super.clickShowMoreButton();
  }

  /**
   * Dismisses the selections made with a multiselect lookup.
   */
  public async dismissSelections(): Promise<void> {
    return (await this.#getSelectionsListHarness()).dismissSelections();
  }

  /**
   * Gets the "Show more" picker harness.
   */
  public async getShowMorePicker(): Promise<SkyLookupShowMorePickerHarness> {
    const pickerId = await (
      await (await this.#getAutocompleteHarness()).host()
    ).getAttribute('data-sky-lookup-show-more-picker-id');

    const defaultPicker = await this.#documentRootLocator.locatorForOptional(
      SkyLookupShowMorePickerHarness.with({ selector: `#${pickerId}` }),
    )();

    if (!defaultPicker) {
      throw new Error(
        'Cannot get the "Show more" picker because it is not open.',
      );
    }

    return defaultPicker;
  }

  /**
   * Gets a list of selections made with a multiselect lookup.
   */
  public async getSelections(): Promise<SkyLookupSelectionHarness[]> {
    return (await this.#getSelectionsListHarness()).getSelections();
  }

  /**
   * Gets the text content of all selections made with a multiselect lookup.
   */
  public async getSelectionsText(): Promise<string[]> {
    return (await this.#getSelectionsListHarness()).getSelectionsText();
  }

  /**
   * Whether the lookup allows for multiple selections.
   */
  public async isMultiselect(): Promise<boolean> {
    return !(await (await this.#getWrapper()).hasClass('sky-lookup-single'));
  }
}
