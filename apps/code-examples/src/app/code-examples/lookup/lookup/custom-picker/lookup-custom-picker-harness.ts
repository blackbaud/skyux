import { ComponentHarness } from '@angular/cdk/testing';
import { SkyCheckboxHarness } from '@skyux/forms/testing';

export class LookupCustomPickerHarness extends ComponentHarness {
  public static hostSelector = '.lookup-custom-picker-modal';

  #getCheckboxes = this.locatorForAll(SkyCheckboxHarness);
  #getSaveButton = this.locatorFor('.lookup-custom-picker-save-button');

  public async checkItemAt(index: number): Promise<void> {
    return (await this.#getCheckboxes())[index].check();
  }

  public async uncheckItemAt(index: number): Promise<void> {
    return (await this.#getCheckboxes())[index].uncheck();
  }

  public async save(): Promise<void> {
    return (await this.#getSaveButton()).click();
  }
}
