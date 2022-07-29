import { BaseHarnessFilters } from '@angular/cdk/testing';

export interface SkyHarnessFilters extends BaseHarnessFilters {
  dataSkyId: string | RegExp;
}
