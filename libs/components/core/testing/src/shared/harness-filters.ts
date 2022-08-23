import { BaseHarnessFilters } from '@angular/cdk/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyComponentHarness` instances.
 */
export interface SkyHarnessFilters extends BaseHarnessFilters {
  /**
   * Only find instances whose `data-sky-id` attribute matches the given value.
   */
  dataSkyId?: string | RegExp;
}
