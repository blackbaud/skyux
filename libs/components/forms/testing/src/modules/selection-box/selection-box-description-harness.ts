import { SkyComponentHarness } from '@skyux/core/testing';

/**
 * Harness to interact with a selection box description component in tests.
 * @internal
 */
export class SkySelectionBoxDescriptionHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-selection-box-description';

  /**
   * Gets the description text.
   */
  public async getText(): Promise<string> {
    return (await (await this.host()).text()).trim();
  }
}
