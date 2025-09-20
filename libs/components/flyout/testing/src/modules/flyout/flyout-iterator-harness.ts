import { ComponentHarness, TestElement } from '@angular/cdk/testing';

/**
 * Harness for interacting with a flyout iterator component in tests.
 * @internal
 */
export class SkyFlyoutIteratorHarness extends ComponentHarness {
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
    if (await this.#buttonIsDisabled(button)) {
      throw new Error(
        'Could not click the next iterator because it is disabled.',
      );
    }
    await button.click();
  }

  /**
   * Clicks the previous button.
   */
  public async clickPreviousButton(): Promise<void> {
    const button = await this.#getPreviousButton();
    if (await this.#buttonIsDisabled(button)) {
      throw new Error(
        'Could not click the previous iterator because it is disabled.',
      );
    }
    await button.click();
  }

  async #buttonIsDisabled(button: TestElement): Promise<boolean> {
    const disabled = await button.getAttribute('disabled');
    return disabled !== null;
  }
}
