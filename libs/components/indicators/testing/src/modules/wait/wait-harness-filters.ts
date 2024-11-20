import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of SkyWaitHarness instances.
 */

export interface SkyWaitHarnessFilters extends SkyHarnessFilters {
  /**
   * Only find blocking or non-blocking instances created by the `SkyWaitService`.
   */
  servicePageWaitType?: 'blocking' | 'non-blocking';
}
