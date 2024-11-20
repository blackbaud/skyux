import { SkyComponentHarness } from '@skyux/core/testing';

/**
 * Harness for interacting with a key info label component in tests.
 * @internal
 */
export class SkyKeyInfoLabelHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-key-info-label';

  /**
   * Gets the text value of the component content.
   */
  public async getText(): Promise<string> {
    return await (await this.host()).text();
  }
}
