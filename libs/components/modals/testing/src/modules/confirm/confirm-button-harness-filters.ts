import { BaseHarnessFilters } from '@angular/cdk/testing';

/**
 * A set of criteria that can be used to filter a list of SkyConfirmButtonHarness instances.
 */
export interface SkyConfirmButtonHarnessFilters
  extends Omit<BaseHarnessFilters, 'selector'> {
  /**
   * Only find instances whose content matches the given value.
   */
  text?: string | RegExp;

  /**
   * Only find instances whose style matches the given value.
   */
  styleType?: string;
}
