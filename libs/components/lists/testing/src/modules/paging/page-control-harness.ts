import { ComponentHarness, TestElement } from '@angular/cdk/testing';

/**
 * Harness to interact with a page control element in tests.
 */
export class SkyPageControlHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'li.sky-list-paging-link';

  #getButton = this.locatorFor('button.sky-paging-btn');

  /**
   * Clicks the page button.
   */
  public async clickButton(): Promise<void> {
    const button = await this.#getButton();

    if (await this.#buttonIsDisabled(button)) {
      const label = await button.text();
      throw new Error(
        `Could not click page button ${label} because it is currently the active page.`,
      );
    }

    await button.click();
  }

  /**
   * Gets the page button text.
   */
  public async getText(): Promise<string> {
    const button = await this.#getButton();

    return await button.text();
  }

  /**
   * Whether the page button is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    const button = await this.#getButton();
    return await this.#buttonIsDisabled(button);
  }

  async #buttonIsDisabled(button: TestElement): Promise<boolean> {
    const disabled = await button.getAttribute('disabled');
    return disabled !== null;
  }
}
