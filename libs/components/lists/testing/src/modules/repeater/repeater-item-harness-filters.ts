import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyRepeaterItemHarness` instances.
 */
export interface SkyRepeaterItemHarnessFilters extends SkyHarnessFilters {
  /**
   * Only find instances whose content matches the given value.
   */
  contentText?: string | RegExp;

  /**
   * Only find instances whose title matches the given value.
   */
  titleText?: string | RegExp;
}
