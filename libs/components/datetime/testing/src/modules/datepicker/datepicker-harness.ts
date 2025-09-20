import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyDatepickerCalendarHarness } from './datepicker-calendar-harness';
import { SkyDatepickerFilters } from './datepicker-harness.filters';
import { SkyDatepickerInputHarness } from './datepicker-input-harness';
import { SkyFuzzyDatepickerInputHarness } from './fuzzy-datepicker-input-harness';

/**
 * Harness for interacting with datepicker components in tests.
 */
export class SkyDatepickerHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-datepicker, .sky-input-group';

  #documentRootLocator = this.documentRootLocatorFactory();

  #getCalendarButton = this.locatorFor('.sky-input-group-datepicker-btn');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyDatepickerHarness` that meets certain criteria.
   *
   * These filters only work for standalone datepickers. For datepickers
   * wrapped inside `sky-input-box`, place filters on the input box instead and
   * query the datepicker using a `SkyInputBoxHarness`.
   * For the input box implementation, see the code example.
   */
  public static with(
    filters: SkyDatepickerFilters,
  ): HarnessPredicate<SkyDatepickerHarness> {
    return SkyDatepickerHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the calendar button.
   */
  public async clickCalendarButton(): Promise<void> {
    return await (await this.#getCalendarButton()).click();
  }

  /**
   * Gets the `SkyDatepickerCalendarHarness` for the calendar picker controlled by
   * the datepicker. Throws an error if the calendar picker is not open.
   */
  public async getDatepickerCalendar(): Promise<SkyDatepickerCalendarHarness> {
    const calendarId = await this.#getAriaControls();

    if (!calendarId) {
      throw new Error(
        'Unable to get calendar picker because picker is closed.',
      );
    }

    return await this.#documentRootLocator.locatorFor(
      SkyDatepickerCalendarHarness.with({ selector: `#${calendarId}` }),
    )();
  }

  /**
   * Gets the datepicker input harness.
   */
  public async getControl(): Promise<
    SkyDatepickerInputHarness | SkyFuzzyDatepickerInputHarness
  > {
    return await this.locatorFor(
      SkyDatepickerInputHarness,
      SkyFuzzyDatepickerInputHarness,
    )();
  }

  /**
   * Whether the datepicker calendar picker is open.
   */
  public async isDatepickerOpen(): Promise<boolean> {
    return (
      (await (
        await this.#getCalendarButton()
      ).getAttribute('aria-expanded')) === 'true'
    );
  }

  async #getAriaControls(): Promise<string | null> {
    return await (
      await this.#getCalendarButton()
    ).getAttribute('aria-controls');
  }
}
