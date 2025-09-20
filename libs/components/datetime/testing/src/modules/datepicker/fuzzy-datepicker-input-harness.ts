import { SkyInputHarness } from '@skyux/core/testing';

/**
 * Harness to interact with the fuzzy datepicker input harness.
 */
export class SkyFuzzyDatepickerInputHarness extends SkyInputHarness {
  /**
   * @internal
   */
  public static hostSelector = '[skyFuzzyDatepickerInput]';

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

    await (await this.host()).dispatchEvent('change');
    await this.blur();
  }
}
