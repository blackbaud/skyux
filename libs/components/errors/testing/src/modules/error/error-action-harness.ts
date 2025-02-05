import { SkyQueryableComponentHarness } from '@skyux/core/testing';

/**
 * Harness for interacting with an error action component in tests.
 */
export class SkyErrorActionHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-error-action';
}
