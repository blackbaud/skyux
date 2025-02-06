import { BaseHarnessFilters } from '@angular/cdk/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyLookupShowMorePickerHarness` instances.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
export interface SkyLookupShowMorePickerHarnessFilters
  // Omitting 'ancestor', since all we care about is the 'selector' filter,
  // which is used to find a modal instance by its element ID.
  extends Omit<BaseHarnessFilters, 'ancestor'> {}
