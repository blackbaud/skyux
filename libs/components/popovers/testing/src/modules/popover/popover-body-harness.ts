import { SkyQueryableComponentHarness } from '@skyux/core/testing';

/**
 * Harness for interacting with a popover body in tests.
 * @internal
 */
export class SkyPopoverBodyHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.sky-popover-body';

  /**
   * Gets the text of the popover content body.
   */
  public async getText(): Promise<string> {
    return await (await this.host()).text();
  }
}
