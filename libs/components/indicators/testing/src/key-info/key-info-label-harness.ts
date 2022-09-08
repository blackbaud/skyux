import { SkyComponentHarness } from '@skyux/core/testing';

/**
 * @internal
 */
export class SkyKeyInfoLabelHarness extends SkyComponentHarness {
  public static hostSelector = 'sky-key-info-label';

  /**
   * Gets the value of the input.
   */
  public async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
