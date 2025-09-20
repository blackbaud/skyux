import { HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyColorpickerDropdownHarnessFilters } from './colorpicker-dropdown-harness.filters';

/**
 * Harness for interacting with colorpicker dropdown in tests.
 */
export class SkyColorpickerDropdownHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.sky-colorpicker-container';

  #getApplyButton = this.locatorFor('.sky-btn-colorpicker-apply');
  #getCancelButton = this.locatorFor('.sky-btn-colorpicker-close');
  #getInputs = this.locatorForAll('input.sky-form-control');
  #getSwatches = this.locatorForAll('button.sky-preset-color');

  public static with(
    filters: SkyColorpickerDropdownHarnessFilters,
  ): HarnessPredicate<SkyColorpickerDropdownHarness> {
    return new HarnessPredicate(SkyColorpickerDropdownHarness, filters);
  }

  /**
   * Whether transparency is allowed.
   */
  public async allowsTransparency(): Promise<boolean> {
    return !!(await this.#getAlphaInput());
  }

  /**
   * Clicks the colorpicker dropdown apply button.
   */
  public async clickApplyButton(): Promise<void> {
    await (await this.#getApplyButton()).click();
  }

  /**
   * Clicks the colorpicker dropdown cancel button.
   */
  public async clickCancelButton(): Promise<void> {
    await (await this.#getCancelButton()).click();
  }

  /**
   * Clicks a specified swatch in the color preset section.
   * @param swatchHex Hex code of the swatch to click.
   */
  public async clickPresetColorSwatch(swatchHex: string): Promise<void> {
    const swatches = await this.#getSwatchButtons();
    const ariaLabel = `Preset Color: ${swatchHex}`;

    for (const swatch of swatches) {
      if ((await swatch.getAttribute('aria-label')) === ariaLabel) {
        return await swatch.click();
      }
    }
  }

  /**
   * Gets an array of the hex codes of the preset color swatches.
   */
  public async getPresetColorSwatches(): Promise<string[]> {
    const swatches = await this.#getSwatchButtons();

    return await Promise.all(
      swatches.map(async (swatch): Promise<string> => {
        const swatchHex = (await swatch.getAttribute('aria-label'))
          ?.split(':')[1]
          .trim();
        if (!swatchHex) {
          throw new Error('Preset swatch is undefined.');
        }
        return swatchHex;
      }),
    );
  }

  /**
   * Enters a value into the alpha input box.
   * @param value A decimal value from 0-1.
   */
  public async setAlphaValue(value: string): Promise<void> {
    const input = await this.#getAlphaInput();

    if (!input) {
      throw new Error('Alpha input cannot be found.');
    }

    await this.#setInputValue(input, value);
  }

  /**
   * Enters a value into the blue input box.
   * @param value A value from 0-255
   */
  public async setBlueValue(value: string): Promise<void> {
    const input = await this.#getBlueInput();

    await this.#setInputValue(input, value);
  }

  /**
   * Enters a value into the green input box.
   * @param value A value from 0-255
   */
  public async setGreenValue(value: string): Promise<void> {
    const input = await this.#getGreenInput();

    await this.#setInputValue(input, value);
  }

  /**
   * Enters a value into the hex input box.
   * @param value A hex value
   */
  public async setHexValue(value: string): Promise<void> {
    const input = await this.#getHexInput();

    await this.#setInputValue(input, value);
  }

  /**
   * Enters a value into the red input box.
   * @param value A value from 0-255
   */
  public async setRedValue(value: string): Promise<void> {
    const input = await this.#getRedInput();

    await this.#setInputValue(input, value);
  }

  async #getAlphaInput(): Promise<TestElement | null> {
    return (await this.#getInputs())[4];
  }

  async #getBlueInput(): Promise<TestElement> {
    return (await this.#getInputs())[3];
  }

  async #getGreenInput(): Promise<TestElement> {
    return (await this.#getInputs())[2];
  }

  async #getHexInput(): Promise<TestElement> {
    return (await this.#getInputs())[0];
  }

  async #getRedInput(): Promise<TestElement> {
    return (await this.#getInputs())[1];
  }

  async #getSwatchButtons(): Promise<TestElement[]> {
    const swatches = await this.#getSwatches();

    if (swatches.length > 0) {
      return swatches;
    } else {
      throw new Error('No swatches found.');
    }
  }

  async #setInputValue(input: TestElement, value: string): Promise<void> {
    await input.setInputValue(value);
    await input.dispatchEvent('input');
  }
}
