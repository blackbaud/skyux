import { SkyInputHarness } from '@skyux/core/testing';

/**
 * Harness to interact with the file drop link upload input harness.
 */
export class SkyFileDropLinkUploadInputHarness extends SkyInputHarness {
  /**
   * @internal
   */
  public static hostSelector = 'input.sky-form-control';

  /**
   * Gets the input aria-label
   */
  public async getAriaLabel(): Promise<string | null> {
    return await (await this.host()).getAttribute('aria-label');
  }
}
