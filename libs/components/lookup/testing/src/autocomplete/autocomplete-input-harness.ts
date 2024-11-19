import { SkyInputHarness } from '@skyux/core/testing';

/**
 * Harness to interact with the autocomplete input harness.
 */
export class SkyAutocompleteInputHarness extends SkyInputHarness {
  /**
   * @internal
   */
  public static hostSelector = '[skyAutocomplete]';

  /**
   * Returns the value of the input's `aria-controls` attribute.
   */
  public async getAriaControls(): Promise<string | null> {
    return await (await this.host()).getAttribute('aria-controls');
  }
}
