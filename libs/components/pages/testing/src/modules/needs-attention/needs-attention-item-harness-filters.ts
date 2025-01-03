import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of SkyNeedsAttentionItemHarness instances.
 */
export interface SkyNeedsAttentionItemHarnessFilters extends SkyHarnessFilters {
  /**
   * Only find instances whose text content matches the given value.
   */
  text?: string;
}
