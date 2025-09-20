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
   * Blurs the input.
   */
  public override async blur(): Promise<void> {
    await super.blur();

    const host = await this.host();

    await host.dispatchEvent('focusout', {
      relatedTarget: null,
    });
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
