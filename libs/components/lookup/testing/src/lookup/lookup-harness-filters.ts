import { BaseHarnessFilters } from '@angular/cdk/testing';

export interface SkyLookupHarnessFilters extends BaseHarnessFilters {
  skyId?: string | RegExp;
}
