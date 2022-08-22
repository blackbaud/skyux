import { SkyHarnessFilters } from '@skyux/core/testing';

export interface SkyRepeaterItemHarnessFilters extends SkyHarnessFilters {
  bodyTextContent?: string | RegExp;
  title?: string | RegExp;
}
