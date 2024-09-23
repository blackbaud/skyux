import { HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyColorpickerDropdownHarnessFilters } from './colorpicker-dropdown-harness.filters';

export class SkyColorpickerDropdownHarness extends SkyComponentHarness {
  public static hostSelector = '.sky-colorpicker-container';

  #getInputs = this.locatorForAll('input.sky-form-control');
  #getApplyButton = this.locatorFor('sky-btn-colorpicker-apply');
  #getCancelButton = this.locatorFor('sky-btn-colorpicker-close');

  public static with(
    filters: SkyColorpickerDropdownHarnessFilters,
  ): HarnessPredicate<SkyColorpickerDropdownHarness> {
    return SkyColorpickerDropdownHarness.getDataSkyIdPredicate(
      filters,
    ).addOption('id', filters.id, async (harness, id) =>
      HarnessPredicate.stringMatches(await harness.getId(), id),
    );
  }

  public async getId(): Promise<string | null> {
    return (await this.host()).getAttribute('id');
  }

  public async clickApplyButton(): Promise<void> {
    (await this.#getApplyButton()).click();
  }

  public async clickCancelButton(): Promise<void> {
    (await this.#getCancelButton()).click();
  }

  public async setHexValue(value: string): Promise<void> {
    (await this.getHexInput()).setInputValue(value);
  }

  public async setRedInput(value: string): Promise<void> {
    (await this.getRedInput()).setInputValue(value);
  }

  public async setGreenValue(value: string): Promise<void> {
    (await this.getGreenInput()).setInputValue(value);
  }

  public async setBlueValue(value: string): Promise<void> {
    (await this.getBlueInput()).setInputValue(value);
  }

  public async setAlphaValue(value: string): Promise<void> {
    (await this.getAlphaInput()).setInputValue(value);
  }

  private async getHexInput(): Promise<TestElement> {
    return (await this.#getInputs())[0];
  }

  private async getRedInput(): Promise<TestElement> {
    return (await this.#getInputs())[1];
  }

  private async getGreenInput(): Promise<TestElement> {
    return (await this.#getInputs())[2];
  }

  private async getBlueInput(): Promise<TestElement> {
    return (await this.#getInputs())[3];
  }

  private async getAlphaInput(): Promise<TestElement> {
    return (await this.#getInputs())[4];
  }

  // a maybe route
  // #getHexInput = this.locatorFor(`input#sky-colorpicker-hex--${this.getComponentId()}`);
  // private async getComponentId(): Promise<string | undefined> {
  //   return await (await this.getId())?.substring((await this.getId())?.indexOf('--')?? + 1);
  // }
}
