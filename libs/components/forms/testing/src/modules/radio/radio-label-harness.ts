import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Harness for interacting with a radio label component in tests.
 * @internal
 */
export class SkyRadioLabelHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-radio-label';

  #getLabelContent = this.locatorFor('.sky-switch-label');

  /**
   * Gets the text content of the radio label.
   */
  public async getText(): Promise<string> {
    return await (await this.#getLabelContent()).text();
  }
}
