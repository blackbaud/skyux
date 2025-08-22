import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyOverlayHarness } from '@skyux/core/testing';

import { SkyAutocompleteHarness } from '../autocomplete/autocomplete-harness';
import { SkyAutocompleteInputHarness } from '../autocomplete/autocomplete-input-harness';

import { SkyLookupHarnessFilters } from './lookup-harness-filters';
import { SkyLookupSearchResultHarness } from './lookup-search-result-harness';
import { SkyLookupSearchResultHarnessFilters } from './lookup-search-result-harness-filters';
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

  #getInput = this.locatorFor(SkyAutocompleteInputHarness);

  #getSelectionsListHarness = this.locatorFor(SkyLookupSelectionsListHarness);

  #getWrapper = this.locatorFor('.sky-lookup');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyLookupHarness` that meets certain criteria.
   *
   * These filters only work for standalone lookups. For lookups
   * wrapped inside `sky-input-box`, place filters on the input box
   * instead and query the datepicker using a `SkyInputBoxHarness`.
   * For the input box implementation, see the code example.
   */
  public static override with(
    filters: SkyLookupHarnessFilters,
  ): HarnessPredicate<SkyLookupHarness> {
    return SkyLookupHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Blurs the lookup input.
   * @deprecated Call `await (await lookup.getControl()).blur()` instead.
   */
  public override async blur(): Promise<void> {
    await (await super.getControl()).blur();
  }

  /**
   * Clears the lookup input value.
   * @deprecated Call `await (await lookup.getControl()).clear()` instead.
   */
  public override async clear(): Promise<void> {
    await (await super.getControl()).clear();
  }

  /**
   * Clicks the "Add" button on the search results panel.
   */
  public override async clickAddButton(): Promise<void> {
    await (await super.getControl()).focus();
    await super.clickAddButton();
  }

  /**
   * Clicks the "Show more" button on the search results panel.
   */
  public override async clickShowMoreButton(): Promise<void> {
    await (await super.getControl()).focus();
    await super.clickShowMoreButton();
  }

  /**
   * Dismisses the selections made with a multiselect lookup.
   */
  public async dismissSelections(): Promise<void> {
    await (await this.#getSelectionsListHarness()).dismissSelections();
  }

  /**
   * Enters text into the lookup input.
   * @deprecated Call `await (await lookup.getControl()).setValue()` instead.
   */
  public override async enterText(value: string): Promise<void> {
    await (await super.getControl()).setValue(value);
  }

  /**
   * Focuses the lookup input.
   * @deprecated Call `await (await lookup.getControl()).focus()` instead.
   */
  public override async focus(): Promise<void> {
    await (await super.getControl()).focus();
  }

  /**
   * Gets the lookup `aria-labelledby` value.
   * @deprecated Don't use this property. It returns a value from a deprecated input that lookup no longer uses.
   */
  public override async getAriaLabelledby(): Promise<string | null> {
    return await super.getAriaLabelledby();
  }

  /**
   * Returns lookup search result harnesses.
   */
  public override async getSearchResults(
    filters?: SkyLookupSearchResultHarnessFilters,
  ): Promise<SkyLookupSearchResultHarness[]> {
    const overlay = await this.#getOverlay();

    if (!overlay) {
      throw new Error(
        'Unable to retrieve search results. The lookup is closed.',
      );
    }

    return await overlay.queryHarnesses(
      SkyLookupSearchResultHarness.with(filters || {}),
    );
  }

  /**
   * Returns the text content for each lookup search result.
   */
  public override async getSearchResultsText(
    filters?: SkyLookupSearchResultHarnessFilters,
  ): Promise<string[]> {
    const harnesses = await this.getSearchResults(filters);

    const text: string[] = [];
    for (const harness of harnesses) {
      text.push(await harness.getText());
    }

    return text;
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
    return await (await this.#getSelectionsListHarness()).getSelections();
  }

  /**
   * Gets the text content of all selections made with a multiselect lookup.
   */
  public async getSelectionsText(): Promise<string[]> {
    return await (await this.#getSelectionsListHarness()).getSelectionsText();
  }

  /**
   * Gets the value of the lookup input.
   * @deprecated Call `await (await lookup.getControl()).getValue()` instead.
   */
  public override async getValue(): Promise<string> {
    return await (await super.getControl()).getValue();
  }

  /**
   * Whether the lookup input is disabled.
   * @deprecated Call `await (await lookup.getControl()).isDisabled()` instead.
   */
  public override async isDisabled(): Promise<boolean> {
    return await (await super.getControl()).isDisabled();
  }

  /**
   * Whether the lookup input is focused.
   * @deprecated Call `await (await lookup.getControl()).isFocused()` instead.
   */
  public override async isFocused(): Promise<boolean> {
    return await (await super.getControl()).isFocused();
  }

  /**
   * Whether the lookup allows for multiple selections.
   */
  public async isMultiselect(): Promise<boolean> {
    return !(await (await this.#getWrapper()).hasClass('sky-lookup-single'));
  }

  /**
   * Whether the lookup is open.
   */
  public override async isOpen(): Promise<boolean> {
    return await super.isOpen();
  }

  /**
   * Selects a search result.
   */
  public override async selectSearchResult(
    filters: SkyLookupSearchResultHarnessFilters,
  ): Promise<void> {
    await super.selectSearchResult(filters);
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
