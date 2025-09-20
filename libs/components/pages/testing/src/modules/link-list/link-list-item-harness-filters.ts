import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of SkyLinkListItemHarness instances.
 */
export interface SkyLinkListItemHarnessFilters extends SkyHarnessFilters {
  /**
   * Only find instances whose text content matches the given value.
   */
  text?: string;
}
