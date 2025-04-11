import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Harness for interacting with a toggle switch label component in tests.
 * @internal
 */
export class SkyToggleSwitchLabelHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-toggle-switch-label';

  #getLabelContent = this.locatorFor('span[skyTrim]');

  /**
   * Gets the text content of the toggle switch label.
   */
  public async getText(): Promise<string> {
    return await (await this.#getLabelContent()).text();
  }
}
