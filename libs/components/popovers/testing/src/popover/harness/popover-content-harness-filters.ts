import { BaseHarnessFilters } from '@angular/cdk/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyComponentHarness` instances.
 * @internal
 */
export interface SkyPopoverContentHarnessFilters extends BaseHarnessFilters {
  /**
   * Only find instances whose `id` attribute matches the given value.
   */
  popoverId?: string | RegExp;
}
