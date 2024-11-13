import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Harness for interacting with a `labelText` checkbox label component in tests.
 * @internal
 */
export class SkyCheckboxLabelTextLabelHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-checkbox-label-text-label';

  #getLabelContent = this.locatorForOptional('.sky-switch-label');

  /**
   * Gets the text content of the `labelText` checkbox label.
   */
  public async getText(): Promise<string | undefined> {
    return await (await this.#getLabelContent())?.text();
  }
}
