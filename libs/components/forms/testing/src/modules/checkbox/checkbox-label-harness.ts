import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Harness for interacting with a checkbox label component in tests.
 * @internal
 */
export class SkyCheckboxLabelHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-checkbox-label';

  #getLabelContent = this.locatorFor('.sky-switch-label');

  /**
   * Gets the text content of the checkbox label.
   */
  public async getText(): Promise<string> {
    return await (await this.#getLabelContent()).text();
  }
}
