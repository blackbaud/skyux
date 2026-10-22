import { ComponentHarness } from '@angular/cdk/testing';
import { SkyButtonHarness, SkyCheckboxHarness } from '@skyux/forms/testing';

export class PickerHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.lookup-custom-picker-modal';

  #getCheckboxes = this.locatorForAll(SkyCheckboxHarness);
  #getSaveButton = this.locatorFor(
    SkyButtonHarness.with({ dataSkyId: 'custom-picker-save-button' }),
  );

  public async checkItemAt(index: number): Promise<void> {
    await (await this.#getCheckboxes())[index].check();
  }

  public async uncheckItemAt(index: number): Promise<void> {
    await (await this.#getCheckboxes())[index].uncheck();
  }

  public async save(): Promise<void> {
    await (await this.#getSaveButton()).click();
  }
}
