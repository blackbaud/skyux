import { SkyQueryableComponentHarness } from '@skyux/core/testing';

/**
 * Harness to interact with a toolbar view actions component in tests.
 */
export class SkyToolbarViewActionsHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-toolbar-view-actions';
}
