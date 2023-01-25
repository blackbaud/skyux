import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of SkyAlertHarness instances.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SkyWaitHarnessFilters extends SkyHarnessFilters {
  /**
   * Only find blocking or non-blocking instances created by the `SkyWaitService`.
   */
  servicePageWaitType?: 'blocking' | 'non-blocking';
}
