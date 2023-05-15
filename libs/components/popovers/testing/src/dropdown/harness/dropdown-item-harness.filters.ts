import { BaseHarnessFilters } from '@angular/cdk/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyDropdownItemHarness` instances.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SkyDropdownItemHarnessFilters
  extends Omit<BaseHarnessFilters, 'selector'> {
  /**
   * Only find instances whose content matches the given value.
   */
  text?: string;
}
