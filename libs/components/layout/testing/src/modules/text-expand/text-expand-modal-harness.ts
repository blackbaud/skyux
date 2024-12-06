import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Harness for interacting with a text expand modal component in tests.
 */
export class SkyTextExpandModalHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-text-expand-modal';

  #getCloseButton = this.locatorFor('sky-modal-footer button.sky-btn');
  #getHeader = this.locatorFor('sky-modal-header');
  #getText = this.locatorFor('sky-modal-content.sky-text-expand-modal-content');

  /**
   * Clicks the close button.
   */
  public async clickCloseButton(): Promise<void> {
    const button = await this.#getCloseButton();

    await button.click();
  }

  /**
   * Gets the header text of the modal.
   */
  public async getHeaderText(): Promise<string> {
    return await (await this.#getHeader()).text();
  }

  /**
   * Gets the text content of the text expand.
   */
  public async getText(): Promise<string> {
    return await (await this.#getText()).text();
  }
}
