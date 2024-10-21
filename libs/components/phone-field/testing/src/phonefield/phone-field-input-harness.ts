import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Harness to interact with the phone field input harness.
 *
 * This harness is marked as internal as all relevant functions are exposed to consumers through the `SkyPhoneFieldHarness` functions.
 * @internal
 */
export class SkyPhoneFieldInputHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '[skyPhoneFieldInput]';

  /**
   * Blurs the input.
   */
  public async blur(): Promise<void> {
    return (await this.host()).blur();
  }

  /**
   * Clears the input value.
   */
  public async clear(): Promise<void> {
    return (await this.host()).clear();
  }

  /**
   * Enters text into the input.
   */
  public async enterText(value: string): Promise<void> {
    const el = await this.host();
    await el.focus();
    await el.clear();
    await el.sendKeys(value);
  }

  /**
   * Focuses the input.
   */
  public async focus(): Promise<void> {
    return (await this.host()).focus();
  }

  /**
   * Gets the value of the input.
   */
  public async getValue(): Promise<string> {
    return (await this.host()).getProperty('value');
  }

  /**
   * Whether the input is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    const disabled = await (await this.host()).getAttribute('disabled');
    return disabled !== null;
  }

  /**
   * Whether the input is focused.
   */
  public async isFocused(): Promise<boolean> {
    return (await this.host()).isFocused();
  }
}
