import { SkyComponentHarness } from '@skyux/core/testing';

/**
 * Harness for interacting with a flyout iterator component in tests.
 * @internal
 */
export class SkyFlyoutIteratorHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-flyout-iterator';

  #getNextButton = this.locatorFor('.sky-flyout-iterator-next');
  #getPreviousButton = this.locatorFor('.sky-flyout-iterator-previous');

  /**
   * Clicks the next button.
   */
  public async clickNextButton(): Promise<void> {
    const button = await this.#getNextButton();
    await button.click();
  }

  /**
   * Clicks the previous button.
   */
  public async clickPreviousButton(): Promise<void> {
    const button = await this.#getPreviousButton();
    await button.click();
  }
}
