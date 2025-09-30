import { SkyQueryableComponentHarness } from '@skyux/core/testing';

/**
 * Harness to query inside a repeater item context menu component in tests.
 * @internal
 */
export class SkyRepeaterItemContextMenuHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-repeater-item-context-menu';
}
