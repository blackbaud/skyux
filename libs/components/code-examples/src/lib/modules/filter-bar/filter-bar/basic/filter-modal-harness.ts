import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

/**
 * Custom harness for interacting with the filter modal component in tests.
 */
export class FilterModalHarness extends SkyComponentHarness {
  public static hostSelector = '.filter-modal-demo-form';

  #getSelectElement = this.locatorFor(
    'select[formControlName="selectedOption"]',
  );
  #getSaveButton = this.locatorFor('button.sky-btn-primary');
  #getCancelButton = this.locatorFor('button.sky-btn-link');

  public static with(): HarnessPredicate<FilterModalHarness> {
    return new HarnessPredicate(FilterModalHarness, {});
  }

  /**
   * Selects an option and saves the modal.
   */
  public async selectOption(value: number): Promise<void> {
    const select = await this.#getSelectElement();
    await select.selectOptions(value);

    const saveButton = await this.#getSaveButton();
    return await saveButton.click();
  }

  /**
   * Clicks the Cancel button.
   */
  public async clickCancel(): Promise<void> {
    const cancelButton = await this.#getCancelButton();
    return await cancelButton.click();
  }
}
