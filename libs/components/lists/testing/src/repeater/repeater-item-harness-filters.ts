import { SkyHarnessFilters } from '@skyux/core/testing';

export interface SkyRepeaterItemHarnessFilters extends SkyHarnessFilters {
  textContent?: string | RegExp;
}
