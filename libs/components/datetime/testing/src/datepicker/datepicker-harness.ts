import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyDatepickerFilters } from './datepicker-harness.filters';

export class SkyDatepickerHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-datepicker, .sky-input-group';

  #getPickerButton = this.locatorFor('.sky-input-group-datepicker-btn');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyDatepickerHarness` that meets certain criteria.
   *
   * These filters only work for standalone datepickers. For datepickers
   * wrapped inside a `sky-input-box` place filters on the input box and
   * query the datepicker using a `SkyInputBoxHarness`. See the code examples.
   */
  public static with(
    filters: SkyDatepickerFilters,
  ): HarnessPredicate<SkyDatepickerHarness> {
    return SkyDatepickerHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the picker button.
   */
  public async clickPickerButton(): Promise<void> {
    return (await this.#getPickerButton()).click();
  }

  public async isDatepickerOpen(): Promise<boolean> {
    return (
      (await (await this.#getPickerButton()).getAttribute('aria-expanded')) ===
      'true'
    );
  }

  // private async getAriaControls(): Promise<string | null> {
  //   return (await this.#getPickerButton()).getAttribute('aria-controls');
  // }
}
