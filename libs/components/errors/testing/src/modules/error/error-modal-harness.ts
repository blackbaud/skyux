import { SkyComponentHarness } from '@skyux/core/testing';

/**
 * Harness for interacting with an error modal component in tests.
 * @internal
 */
export class SkyErrorModalHarness extends SkyComponentHarness {
  #closeButton = this.locatorFor('.sky-error-modal-close button');
  #description = this.locatorFor('.sky-error-modal-description');
  #title = this.locatorFor('.sky-error-modal-title');

  /**
   * @internal
   */
  public static hostSelector = 'sky-modal:has(.sky-error-modal-container)';

  /**
   * Gets the title of the error modal.
   */
  public async getTitle(): Promise<string> {
    return await (await this.#title()).text();
  }

  /**
   * Gets the description of the error modal.
   */
  public async getDescription(): Promise<string> {
    return await (await this.#description()).text();
  }

  /**
   * Gets the text of the error modal close button.
   */
  public async getCloseText(): Promise<string> {
    return await (await this.#closeButton()).text();
  }

  /**
   * Clicks the error modal close button.
   */
  public async clickCloseButton(): Promise<void> {
    await (await this.#closeButton()).click();
  }
}
