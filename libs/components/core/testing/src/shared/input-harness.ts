import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Harness used to interact with native input elements in tests.
 * @internal
 */
export class SkyInputHarness extends ComponentHarness {
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

  /**
   * Sets the value of the input. The value will be set by simulating key
   * presses that correspond to the given value.
   */
  public async setValue(value: string): Promise<void> {
    const inputEl = await this.host();
    await inputEl.clear();

    // We don't want to send keys for the value if the value is an empty
    // string in order to clear the value. Sending keys with an empty string
    // still results in unnecessary focus events.
    if (value) {
      await inputEl.sendKeys(value);
    }

    // Some input types won't respond to key presses (e.g. `color`) so to be sure that the
    // value is set, we also set the property after the keyboard sequence. Note that we don't
    // want to do it before, because it can cause the value to be entered twice.
    await inputEl.setInputValue(value);
  }
}
