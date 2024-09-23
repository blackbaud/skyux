import { HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyColorpickerDropdownHarnessFilters } from './colorpicker-dropdown-harness.filters';

export class SkyColorpickerDropdownHarness extends SkyComponentHarness {
  public static hostSelector = '.sky-colorpicker-container';

  #getInputs = this.locatorForAll('input.sky-form-control');
  #getApplyButton = this.locatorFor('.sky-btn-colorpicker-apply');
  #getCancelButton = this.locatorFor('.sky-btn-colorpicker-close');
  #getSwatchesModern = this.locatorForAll('button.sky-btn-link');
  #getSwatchesDefault = this.locatorForAll('button.sky-preset-color');

  public static with(
    filters: SkyColorpickerDropdownHarnessFilters,
  ): HarnessPredicate<SkyColorpickerDropdownHarness> {
    return SkyColorpickerDropdownHarness.getDataSkyIdPredicate(
      filters,
    ).addOption('id', filters.id, async (harness, id) =>
      HarnessPredicate.stringMatches(await harness.getId(), id),
    );
  }

  public async clickApplyButton(): Promise<void> {
    return (await this.#getApplyButton()).click();
  }

  public async clickCancelButton(): Promise<void> {
    return (await this.#getCancelButton()).click();
  }

  public async clickSwatch(swatchHex: string): Promise<void> {
    const swatches = await this.getSwatchButtons();
    const ariaLabel = `Preset Color: ${swatchHex}`;

    for (const swatch of swatches) {
      if ((await swatch.getAttribute('aria-label')) === ariaLabel) {
        await swatch.click();
      }
    }
  }

  public async getId(): Promise<string | null> {
    return (await this.host()).getAttribute('id');
  }

  public async setAlphaValue(value: string): Promise<void> {
    const input = await this.getAlphaInput();

    input.setInputValue(value);
    input.dispatchEvent('input');
  }

  public async setBlueValue(value: string): Promise<void> {
    const input = await this.getBlueInput();

    input.setInputValue(value);
    input.dispatchEvent('input');
  }

  public async setGreenValue(value: string): Promise<void> {
    const input = await this.getGreenInput();

    input.setInputValue(value);
    input.dispatchEvent('input');
  }

  public async setHexValue(value: string): Promise<void> {
    const input = await this.getHexInput();

    input.setInputValue(value);
    input.dispatchEvent('input');
  }

  public async setRedValue(value: string): Promise<void> {
    const input = await this.getRedInput();

    input.setInputValue(value);
    input.dispatchEvent('input');
  }

  private async getAlphaInput(): Promise<TestElement> {
    return (await this.#getInputs())[4];
  }

  private async getBlueInput(): Promise<TestElement> {
    return (await this.#getInputs())[3];
  }

  private async getGreenInput(): Promise<TestElement> {
    return (await this.#getInputs())[2];
  }

  private async getHexInput(): Promise<TestElement> {
    return (await this.#getInputs())[0];
  }

  private async getRedInput(): Promise<TestElement> {
    return (await this.#getInputs())[1];
  }

  private async getSwatchButtons(): Promise<TestElement[]> {
    let swatchesModern = await this.#getSwatchesModern();
    swatchesModern = swatchesModern.slice(0, swatchesModern.length - 1);

    const swatchesDefault = await this.#getSwatchesDefault();

    if (swatchesDefault.length > 0) {
      return swatchesDefault;
    } else if (swatchesModern.length > 0) {
      return swatchesModern;
    } else {
      throw new Error('No swatches found.');
    }
  }
}
