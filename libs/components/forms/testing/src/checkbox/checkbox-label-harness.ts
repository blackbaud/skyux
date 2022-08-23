import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Harness for interacting with a checkbox label component in tests.
 */
export class SkyCheckboxLabelHarness extends ComponentHarness {
  public static hostSelector = 'sky-checkbox-label';

  #getLabelContent = this.locatorFor('.sky-switch-label');

  /**
   * Gets the text content of the checkbox label.
   */
  public async getText(): Promise<string> {
    return (await this.#getLabelContent()).text();
  }
}
