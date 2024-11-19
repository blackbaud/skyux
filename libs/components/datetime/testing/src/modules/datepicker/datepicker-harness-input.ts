import { SkyInputHarness } from '@skyux/core/testing';

/**
 * Harness to interact with the datepicker input harness.
 */
export class SkyDatepickerInputHarness extends SkyInputHarness {
  /**
   * @internal
   */
  public static hostSelector = '[skyDatepickerInput]';

  /**
   * Sets the value of the input.
   */
  public override async setValue(value: string): Promise<void> {
    await super.setValue(value);

    await (await this.host()).blur();
    await (await this.host()).dispatchEvent('change');
  }
}
