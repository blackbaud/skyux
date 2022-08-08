import { BaseHarnessFilters } from '@angular/cdk/testing';

/**
 * @experimental
 */
export interface SkyHarnessFilters extends BaseHarnessFilters {
  dataSkyId: string | RegExp;
}
