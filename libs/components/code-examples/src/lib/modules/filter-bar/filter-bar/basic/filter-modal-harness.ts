import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyRadioGroupHarness, SkyRadioHarness } from '@skyux/forms/testing';

/**
 * Custom harness for interacting with the filter modal component in tests.
 */
export class FilterModalHarness extends SkyComponentHarness {
  public static hostSelector = '.filter-modal-demo-form';

  #getSaveButton = this.locatorFor('button.sky-btn-primary');
  #getCancelButton = this.locatorFor('button.sky-btn-link');
  #getRadioGroup = this.locatorFor(SkyRadioGroupHarness);

  public static with(): HarnessPredicate<FilterModalHarness> {
    return new HarnessPredicate(FilterModalHarness, {});
  }

  /**
   * Selects a radio button based on its 0-based index within the group.
   * Returns the label text of the selected radio button.
   */
  public async selectOptionByIndex(index: number): Promise<string | undefined> {
    const group = await this.#getRadioGroup();
    const radios = await group.getRadioButtons();
    if (index < 0 || index >= radios.length) {
      throw new Error(
        `Radio index ${index} is out of bounds (found ${radios.length} radios).`,
      );
    }
    const radio = radios[index];
    await radio.check();
    const label = await radio.getLabelText();
    await (await this.#getSaveButton()).click();
    return label;
  }

  /**
   * Selects the radio button with label text that matches the provided, case-sensitive label.
   * Returns `true` if the radio button is found and selected.
   */
  public async selectOptionByLabel(labelText: string): Promise<boolean> {
    const group = await this.#getRadioGroup();
    const radios = await group.getRadioButtons();
    for (const radio of radios) {
      if ((await radio.getLabelText()) === labelText) {
        await radio.check();
        await (await this.#getSaveButton()).click();
        return true;
      }
    }
    return false;
  }

  /**
   * Returns all radio button labels in the order that they appear in the modal. This does not modify the selection.
   */
  public async getOptionLabels(): Promise<(string | undefined)[]> {
    const group = await this.#getRadioGroup();
    const radios = await group.getRadioButtons();
    const labels: (string | undefined)[] = [];
    for (const radio of radios) {
      labels.push(await radio.getLabelText());
    }
    return labels;
  }

  /**
   * Returns the selected radio button. Returns `undefined` if none are selected.
   */
  public async getCheckedRadio(): Promise<SkyRadioHarness | undefined> {
    const group = await this.#getRadioGroup();
    const radios = await group.getRadioButtons();
    for (const radio of radios) {
      if (await radio.isChecked()) {
        return radio;
      }
    }
    return undefined;
  }

  /**
   * Clicks the Cancel button.
   */
  public async clickCancel(): Promise<void> {
    const cancelButton = await this.#getCancelButton();
    await cancelButton.click();
  }
}
