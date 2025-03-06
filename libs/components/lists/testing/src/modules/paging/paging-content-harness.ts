import { SkyQueryableComponentHarness } from '@skyux/core/testing';

/**
 * Harness to interact with a paging content component in tests.
 */
export class SkyPagingContentHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-paging-content';
}
