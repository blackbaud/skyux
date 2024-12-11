import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyInputBoxHarness } from '../../input-box/input-box-harness';

/**
 * Harness for interacting with a file drop upload link component in tests.
 * @internal
 */
export class SkyFileDropLinkUploadHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.sky-file-drop-link';

  #input = this.locatorFor('input.sky-form-control');
  #inputBoxHarness = this.locatorFor(SkyInputBoxHarness);
  #button = this.locatorFor('button.sky-btn-primary');

  /**
   * Gets the link upload aria-label.
   */
  public async getAriaLabel(): Promise<string | undefined> {
    return (await (await this.#input()).getAttribute('aria-label'))?.trim();
  }

  /**
   * Gets the hint text.
   */
  public async getHintText(): Promise<string | undefined> {
    return await (await this.#inputBoxHarness()).getHintText();
  }

  /**
   * Whether the `Done` button is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    return (await (await this.#button()).getAttribute('disabled')) !== null;
  }

  /**
   * Clicks the `Done` button
   */
  public async clickButton(): Promise<void> {
    return await (await this.#button()).click();
  }

  /**
   * Sets the input value.
   */
  public async enterLink(link: string): Promise<void> {
    const input = await this.#input();
    await input.clear();
    await input.sendKeys(link);
  }
}
