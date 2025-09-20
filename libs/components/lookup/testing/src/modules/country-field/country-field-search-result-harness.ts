import { HarnessPredicate } from '@angular/cdk/testing';

import { SkyAutocompleteSearchResultHarness } from '../autocomplete/autocomplete-search-result-harness';

import { SkyCountryFieldSearchResultHarnessFilters } from './country-field-search-result-harness-filters';

/**
 * Harness for interacting with an autocomplete search result in tests.
 */
export class SkyCountryFieldSearchResultHarness extends SkyAutocompleteSearchResultHarness {
  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyCountryFieldSearchResultHarness` that meets certain criteria.
   */
  public static override with(
    filters: SkyCountryFieldSearchResultHarnessFilters,
  ): HarnessPredicate<SkyCountryFieldSearchResultHarness> {
    return new HarnessPredicate(
      SkyCountryFieldSearchResultHarness,
      filters,
    ).addOption('textContent', filters.text, async (harness, text) => {
      const searchResultText = await harness.getText();
      return await HarnessPredicate.stringMatches(searchResultText, text);
    });
  }

  /**
   * Returns the value of the search result's descriptor property.
   * This is not needed by country field because it is always set to the country name,
   * and the method is marked internal to prevent it from being documented publicly.
   * @internal
   */
  public override async getDescriptorValue(): Promise<string> {
    return await super.getDescriptorValue();
  }
}
