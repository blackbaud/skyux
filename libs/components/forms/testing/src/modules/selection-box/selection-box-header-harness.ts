import { SkyComponentHarness } from '@skyux/core/testing';

/**
 * Harness to interact with a selection box header component in tests.
 * @internal
 */
export class SkySelectionBoxHeaderHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-selection-box-header';

  /**
   * Gets the header text.
   */
  public async getText(): Promise<string> {
    return (await (await this.host()).text()).trim();
  }
}
