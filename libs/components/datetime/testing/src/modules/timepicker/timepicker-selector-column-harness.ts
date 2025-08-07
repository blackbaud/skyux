import {
  BaseHarnessFilters,
  ComponentHarness,
  HarnessPredicate,
} from '@angular/cdk/testing';

/**
 * Harness for interacting with timepicker selector column in tests.
 * @internal
 */
export class SkyTimepickerSelectorColumnHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'section.sky-timepicker-column';

  #getButtons = this.locatorForAll('li > button');
  #getSelected = this.locatorForOptional('.sky-btn-active');

  /**
   * @internal
   */
  public static with(
    filters: BaseHarnessFilters,
  ): HarnessPredicate<SkyTimepickerSelectorColumnHarness> {
    return new HarnessPredicate(SkyTimepickerSelectorColumnHarness, filters);
  }

  /**
   * Clicks the specified button.
   */
  public async clickButton(value: string): Promise<void> {
    const buttons = await this.#getButtons();
    let match = false;

    for (const button of buttons) {
      const label = (await button.text()).trim();

      if (this.#equals(label, value)) {
        await button.click();
        match = true;
      }
    }

    if (!match) {
      throw new Error();
    }
  }

  /**
   * Gets the selected value.
   */
  public async getSelectedValue(): Promise<string | undefined> {
    return (await (await this.#getSelected())?.text())?.trim();
  }

  #equals(a: string, b: string): boolean {
    const numA = parseInt(a);
    const numB = parseInt(b);
    if (isNaN(numA)) {
      if (isNaN(numB)) {
        return a === b;
      } else {
        return false;
      }
    } else {
      return numA === numB;
    }
  }
}
