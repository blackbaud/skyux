import { SkyQueryableComponentHarness } from '@skyux/core/testing';

/**
 * Harness to interact with the split view drawer component in tests.
 */
export class SkySplitViewDrawerHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-split-view-drawer';

  #getDrawer = this.locatorFor('.sky-split-view-drawer');

  /**
   * The aria-label property of the split view drawer
   */
  public async getAriaLabel(): Promise<string | null> {
    return await (await this.#getDrawer()).getAttribute('aria-label');
  }
}
