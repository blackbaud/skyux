import { BaseHarnessFilters } from '@angular/cdk/testing';

export interface SkyTokenHarnessFilters
  extends Omit<BaseHarnessFilters, 'selector'> {
  textContent?: string | RegExp;
}
