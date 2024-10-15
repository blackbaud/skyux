import { HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyDatepickerPickerHarnessFilters } from './datepicker-picker-harness.filters';

/**
 * Harness for interacting with colorpicker dropdown in tests.
 */
export class SkyDatepickerPickerHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.sky-datepicker-calendar-container';

  #getPreviousButton = this.locatorFor('.sky-datepicker-btn-previous');
  #getNextButton = this.locatorFor('.sky-datepicker-btn-next');
  #getTitleButton = this.locatorFor('.sky-datepicker-calendar-title');
  #getDaypicker = this.locatorForOptional('sky-daypicker');
  #getMonthpicker = this.locatorForOptional('sky-monthpicker');
  #getSelected = this.locatorFor('.sky-datepicker-btn-selected > span');

  public static with(
    filters: SkyDatepickerPickerHarnessFilters,
  ): HarnessPredicate<SkyDatepickerPickerHarness> {
    return new HarnessPredicate(SkyDatepickerPickerHarness, filters);
  }

  /**
   * Gets the current picker calendar mode.
   */
  public async getCalenderMode(): Promise<string> {
    if (await this.#getDaypicker()) {
      return 'day';
    } else if (await this.#getMonthpicker()) {
      return 'month';
    } else {
      return 'year';
    }
  }

  /**
   * Gets the value of the currently selected calendar item.
   */
  public async getSelectedValue(): Promise<string> {
    return (await (await this.#getSelected()).text()).trim();
  }

  /**
   * Clicks the 'previous' button on the calendar picker.
   */
  public async clickPreviousButton(): Promise<void> {
    return (await this.#getPreviousButton()).click();
  }

  /**
   *  Clicks the 'next' button on the calendar picker.
   */
  public async clickNextButton(): Promise<void> {
    return (await this.#getNextButton()).click();
  }

  /**
   * Clicks the 'title' button on the calender picker.
   */
  public async clickTitleButton(): Promise<void> {
    const button = await this.#getTitleButton();

    if(button.getAttribu)
  }
}
