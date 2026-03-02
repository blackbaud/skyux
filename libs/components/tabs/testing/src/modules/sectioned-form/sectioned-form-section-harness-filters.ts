import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of `SkySectionedFormSectionHarness` instances.
 */
export interface SkySectionedFormSectionHarnessFilters extends SkyHarnessFilters {
  /**
   * Finds a section whose heading matches the given value.
   */
  sectionHeading?: string;
}
