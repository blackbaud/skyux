import { SkyRepeaterItemHarnessFilters } from '@skyux/lists/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyLookupShowMorePickerSearchResultHarness` instances.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SkyLookupShowMorePickerSearchResultHarnessFilters
  extends Omit<SkyRepeaterItemHarnessFilters, 'titleText' | 'ancestor'> {}
