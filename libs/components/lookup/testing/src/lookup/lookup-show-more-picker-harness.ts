import { HarnessPredicate } from '@angular/cdk/testing';

import { SkySelectionModalHarness } from '../selection-modal/selection-modal-harness';

import { SkyLookupShowMorePickerHarnessFilters } from './lookup-show-more-picker-harness-filters';
import { SkyLookupShowMorePickerSearchResultHarness } from './lookup-show-more-picker-search-result-harness';
import { SkyLookupShowMorePickerSearchResultHarnessFilters } from './lookup-show-more-picker-search-result-harness-filters';

/**
 * Harness for interacting with a lookup's "Show more" picker in tests.
 * @internal
 */
export class SkyLookupShowMorePickerHarness extends SkySelectionModalHarness {
  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyLookupShowMorePickerHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyLookupShowMorePickerHarnessFilters
  ): HarnessPredicate<SkyLookupShowMorePickerHarness> {
    return new HarnessPredicate(SkyLookupShowMorePickerHarness, filters);
  }

  /**
   * Selects multiple search results based on a set of criteria.
   */
  public async selectSearchResult(
    filters?: SkyLookupShowMorePickerSearchResultHarnessFilters
  ): Promise<void> {
    return super.selectSearchResult(filters);
  }

  /**
   * Gets a list of search results.
   */
  public async getSearchResults(
    filters?: SkyLookupShowMorePickerSearchResultHarnessFilters
  ): Promise<SkyLookupShowMorePickerSearchResultHarness[]> {
    return super.getSearchResults(filters);
  }
}
