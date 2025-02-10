import { BaseHarnessFilters } from '@angular/cdk/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyToastHarness` instances.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
export interface SkyToastHarnessFilters extends BaseHarnessFilters {
  /**
   * Finds toasts with the matching toast id.
   */
  dataToastIdNumber?: number;

  /**
   * Finds toasts with the matching text.
   */
  message?: string;
}
