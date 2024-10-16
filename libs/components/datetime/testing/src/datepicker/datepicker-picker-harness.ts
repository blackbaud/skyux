import { HarnessPredicate } from '@angular/cdk/testing';
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
  #getTitle = this.locatorFor('.sky-datepicker-calendar-title > strong');

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

    if (await button.hasClass('.sky-btn-disabled')) {
      throw new Error('Title button is disabled.');
    }

    return button.click();
  }

  /**
   * Gets the current title.
   */
  public async getCalendarTitle(): Promise<string> {
    return (await (await this.#getTitle()).text()).trim();
  }

  /**
   * Clicks the specified date, month or year.
   * @params the specified value to click, in the following format
   * day format: dddd, MMMM Do YYYY
   * month format: MMMM YYYY
   * year format: YYYY
   */
  public async clickDate(date: string): Promise<void> {
    try {
      return (await this.locatorFor(`[aria-label]=${date}`)()).click();
    } catch {
      throw new Error(
        `Unable to find date with label "${date}". Check that the format is correct and matches the current calendar mode.`,
      );
    }
  }
}
