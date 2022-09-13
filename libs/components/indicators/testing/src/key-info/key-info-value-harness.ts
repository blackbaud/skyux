import { SkyComponentHarness } from '@skyux/core/testing';

/**
 * Harness for interacting with a key info value component in tests.
 * @internal
 */
export class SkyKeyInfoValueHarness extends SkyComponentHarness {
  public static hostSelector = 'sky-key-info-value';

  /**
   * Gets the text value of the component content.
   */
  public async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
