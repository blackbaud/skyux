import { BaseHarnessFilters } from '@angular/cdk/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyComponentHarness` instances.
 */
export interface SkyHarnessFilters extends BaseHarnessFilters {
  /**
   * Find a component based on the value of its `data-sky-id` attribute.
   */
  dataSkyId?: string | RegExp;
}
