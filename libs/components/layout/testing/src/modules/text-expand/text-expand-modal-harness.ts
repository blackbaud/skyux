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
  #getHeader = this.locatorFor('sky-modal-heading');
  #getText = this.locatorFor('sky-modal-content.sky-text-expand-modal-content');

  /**
   * Clicks the modal close button.
   */
  public async clickCloseButton(): Promise<void> {
    const button = await this.#getCloseButton();

    await button.click();
  }

  /**
   * Gets the modal title.
   */
  public async getExpandModalTitle(): Promise<string> {
    return await (await this.#getHeader()).text();
  }

  /**
   * Gets the expanded text in the modal.
   */
  public async getText(): Promise<string> {
    return await (await this.#getText()).text();
  }
}
