import { SkyRepeaterItemHarnessFilters } from '@skyux/lists/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyDataManagerColumnPickerSearchResultHarness` instances.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
export interface SkyDataManagerColumnPickerColumnHarnessFilters
  // Omitting 'ancestor' since it is not relevant filter for the picker's results.
  extends Omit<SkyRepeaterItemHarnessFilters, 'ancestor'> {}
