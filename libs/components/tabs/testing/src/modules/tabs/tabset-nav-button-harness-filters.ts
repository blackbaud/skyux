import { SkyHarnessFilters } from '@skyux/core/testing';
import { SkyTabsetNavButtonType } from '@skyux/tabs';

/**
 * A set of criteria that can be used to filter a list of `SkyTabsetNavButtonHarness` instances.
 */
export interface SkyTabsetNavButtonHarnessFilters extends SkyHarnessFilters {
  /**
   * Finds the tabset nav button whose `buttonType` matches the given value.
   */
  buttonType?: SkyTabsetNavButtonType;
}
