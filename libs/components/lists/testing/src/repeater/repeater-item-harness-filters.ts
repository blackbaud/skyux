import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyRepeaterItemHarness` instances.
 */
export interface SkyRepeaterItemHarnessFilters extends SkyHarnessFilters {
  bodyText?: string | RegExp;
  titleText?: string | RegExp;
}
