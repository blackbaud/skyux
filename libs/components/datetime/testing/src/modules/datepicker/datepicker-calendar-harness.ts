import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyDatepickerCalendarHarnessFilters } from './datepicker-calendar-harness.filters';

/**
 * Harness for interacting with datepicker calendar in tests.
 */
export class SkyDatepickerCalendarHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.sky-datepicker-calendar-container';

  #getDaypicker = this.locatorForOptional('sky-daypicker');
  #getMonthpicker = this.locatorForOptional('sky-monthpicker');
  #getNextButton = this.locatorFor('.sky-datepicker-btn-next');
  #getPreviousButton = this.locatorFor('.sky-datepicker-btn-previous');
  #getSelected = this.locatorFor('.sky-datepicker-btn-selected');
  #getTitle = this.locatorFor('.sky-datepicker-calendar-title');
  #getTitleButton = this.locatorFor('.sky-datepicker-calendar-title');

  /**
   * @internal
   */
  public static with(
    filters: SkyDatepickerCalendarHarnessFilters,
  ): HarnessPredicate<SkyDatepickerCalendarHarness> {
    return new HarnessPredicate(SkyDatepickerCalendarHarness, filters);
  }

  /**
   * Clicks the specified date, month or year in the following format
   * day format: dddd, MMMM Do YYYY
   * month format: MMMM YYYY
   * year format: YYYY
   */
  public async clickDate(date: string): Promise<void> {
    try {
      await (await this.locatorFor(`[aria-label="${date}"]`)()).click();
    } catch {
      throw new Error(
        `Unable to find date with label "${date}". Check that the format is correct and matches the current calendar mode.`,
      );
    }
  }

  /**
   *  Clicks the 'next' button on the calendar header.
   */
  public async clickNextButton(): Promise<void> {
    await (await this.#getNextButton()).click();
  }

  /**
   * Clicks the 'previous' button on the calendar header.
   */
  public async clickPreviousButton(): Promise<void> {
    await (await this.#getPreviousButton()).click();
  }

  /**
   * Clicks the 'title' button on the calendar header.
   */
  public async clickTitleButton(): Promise<void> {
    const button = await this.#getTitleButton();

    if ((await button.getAttribute('disabled')) !== null) {
      throw new Error('Title button is disabled.');
    }

    await button.click();
  }

  /**
   * Gets the current calendar mode.
   */
  public async getCalendarMode(): Promise<string> {
    if (await this.#getDaypicker()) {
      return 'day';
    } else if (await this.#getMonthpicker()) {
      return 'month';
    } else {
      return 'year';
    }
  }

  /**
   * Gets the current title.
   */
  public async getCalendarTitle(): Promise<string> {
    return (await (await this.#getTitle()).text()).trim();
  }

  /**
   * Gets the long date value of the currently selected calendar item.
   */
  public async getSelectedValue(): Promise<string | null> {
    return await (await this.#getSelected()).getAttribute('aria-label');
  }
}
