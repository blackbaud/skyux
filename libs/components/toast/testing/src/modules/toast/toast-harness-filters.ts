import { BaseHarnessFilters } from '@angular/cdk/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyToastHarness` instances.
 */
export interface SkyToastHarnessFilters extends BaseHarnessFilters {
  /**
   * Finds toasts with the matching text.
   */
  message?: string;
}
