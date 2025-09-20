import { HarnessPredicate } from '@angular/cdk/testing';

import { SkyAutocompleteSearchResultHarness } from '../autocomplete/autocomplete-search-result-harness';

import { SkyLookupSearchResultHarnessFilters } from './lookup-search-result-harness-filters';

/**
 * Harness for interacting with an autocomplete search result in tests.
 */
export class SkyLookupSearchResultHarness extends SkyAutocompleteSearchResultHarness {
  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyLookupSearchResultHarness` that meets certain criteria.
   */
  public static override with(
    filters: SkyLookupSearchResultHarnessFilters,
  ): HarnessPredicate<SkyLookupSearchResultHarness> {
    return new HarnessPredicate(
      SkyLookupSearchResultHarness,
      filters,
    ).addOption('textContent', filters.text, async (harness, text) => {
      const searchResultText = await harness.getText();
      return await HarnessPredicate.stringMatches(searchResultText, text);
    });
  }

  /**
   * Returns the value of the search result's descriptor property.
   */
  public override async getDescriptorValue(): Promise<string> {
    return await super.getDescriptorValue();
  }
}
