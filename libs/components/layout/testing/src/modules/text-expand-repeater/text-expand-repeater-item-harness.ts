import { SkyQueryableComponentHarness } from '@skyux/core/testing';

/**
 * Harness for interacting with a text expand repeater items in tests.
 */
export class SkyTextExpandRepeaterItemHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'li.sky-text-expand-repeater-item';
}
