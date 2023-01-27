import { SkySelectionModalSearchResultHarnessFilters } from '../selection-modal/selection-modal-search-result-harness-filters';

/**
 * A set of criteria that can be used to filter a list of `SkyLookupShowMorePickerSearchResultHarness` instances.
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SkyLookupShowMorePickerSearchResultHarnessFilters
  // Omitting 'titleText' and 'ancestor' since they are not relevant filters for the picker's search results.
  extends SkySelectionModalSearchResultHarnessFilters {}
