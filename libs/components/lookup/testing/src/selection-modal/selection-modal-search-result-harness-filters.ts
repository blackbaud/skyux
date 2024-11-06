import { SkyRepeaterItemHarnessFilters } from '@skyux/lists/testing';

/**
 * A set of criteria that can be used to filter a list of `SkySelectionModalSearchResultHarness` instances.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
export interface SkySelectionModalSearchResultHarnessFilters
  // Omitting 'titleText' and 'ancestor' since they are not relevant filters for the picker's search results.
  extends Omit<SkyRepeaterItemHarnessFilters, 'titleText' | 'ancestor'> {}
