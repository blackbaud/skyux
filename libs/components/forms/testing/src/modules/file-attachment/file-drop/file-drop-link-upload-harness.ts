import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyInputBoxHarness } from '../../input-box/input-box-harness';

import { SkyFileDropLinkUploadInputHarness } from './file-drop-link-upload-input-harness';

/**
 * Harness for interacting with file drop component's link upload feature in tests.
 */
export class SkyFileDropLinkUploadHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.sky-file-drop-link';

  #input = this.locatorFor(SkyFileDropLinkUploadInputHarness);
  #inputBoxHarness = this.locatorFor(SkyInputBoxHarness);
  #button = this.locatorFor('button.sky-btn-primary');

  /**
   * Clicks the `Done` button
   */
  public async clickDoneButton(): Promise<void> {
    if (await this.isDisabled()) {
      throw new Error('Done button is disabled and cannot be clicked.');
    }
    return await (await this.#button()).click();
  }

  /**
   * Enters text into the link upload input.
   */
  public async enterText(link: string): Promise<void> {
    return await (await this.#input()).setValue(link);
  }

  /**
   * Gets the link upload aria-label.
   */
  public async getAriaLabel(): Promise<string | null> {
    return await (await this.#input()).getAriaLabel();
  }

  /**
   * Gets the hint text.
   */
  public async getHintText(): Promise<string | undefined> {
    return await (await this.#inputBoxHarness()).getHintText();
  }

  /**
   * Gets the input harness for upload link.
   */
  public async getInput(): Promise<SkyFileDropLinkUploadInputHarness> {
    return await this.#input();
  }

  /**
   * Whether the `Done` button is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    return (await (await this.#button()).getAttribute('disabled')) !== null;
  }
}
