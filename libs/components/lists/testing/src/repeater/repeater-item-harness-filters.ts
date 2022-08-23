import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyRepeaterItemHarness` instances.
 */
export interface SkyRepeaterItemHarnessFilters extends SkyHarnessFilters {
  /**
   * Find a repeater item based on the text of its content area.
   */
  contentText?: string | RegExp;

  /**
   * Find a repeater item based on the text of its title.
   */
  titleText?: string | RegExp;
}
