import { SkyInputHarness } from '@skyux/core/testing';

/**
 * Harness to interact with the timepicker input harness.
 */
export class SkyTimepickerInputHarness extends SkyInputHarness {
  /**
   * @internal
   */
  public static hostSelector = '[skyTimepickerInput]';

  /**
   * Blurs the input.
   */
  public override async blur(): Promise<void> {
    await super.blur();

    const host = await this.host();

    await host.dispatchEvent('focusout', { relatedTarget: null });
  }

  /**
   * Sets the value of the input.
   */
  public override async setValue(value: string): Promise<void> {
    await super.setValue(value);

    await this.blur();
    await (await this.host()).dispatchEvent('change');
  }
}
