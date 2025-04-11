import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

import { SkyTimepickerSelectorColumnHarness } from './timepicker-selector-column-harness';
import { SkyTimepickerSelectorHarnessFilters } from './timepicker-selector-harness-filters';

/**
 * Harness for interacting with a timepicker selector in tests.
 */
export class SkyTimepickerSelectorHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.sky-timepicker-container';

  #getHours = this.locatorFor(
    SkyTimepickerSelectorColumnHarness.with({
      selector: '.sky-timepicker-column-hours',
    }),
  );
  #getMeridies = this.locatorForOptional(
    SkyTimepickerSelectorColumnHarness.with({
      selector: '.sky-timepicker-column-meridies',
    }),
  );
  #getMinutes = this.locatorFor(
    SkyTimepickerSelectorColumnHarness.with({
      selector: '.sky-timepicker-column-minutes',
    }),
  );

  /**
   * @internal
   */
  public static with(
    filters: SkyTimepickerSelectorHarnessFilters,
  ): HarnessPredicate<SkyTimepickerSelectorHarness> {
    return new HarnessPredicate(SkyTimepickerSelectorHarness, filters);
  }

  /**
   * Clicks the specified hour button, or throws an error if it does not exist.
   */
  public async clickHour(value: string): Promise<void> {
    try {
      await (await this.#getHours()).clickButton(value);
    } catch {
      throw new Error(`Unable to find hour button with label "${value}".`);
    }
  }

  /**
   * Clicks the specified meridie button, or throws an error if it does not exist.
   */
  public async clickMeridie(value: string): Promise<void> {
    try {
      const meridies = await this.#getMeridies();
      if (!meridies) {
        throw new Error();
      }
      await meridies.clickButton(value);
    } catch {
      throw new Error(`Unable to find meridie button with label "${value}".`);
    }
  }

  /**
   * Clicks the specified minute button, or throws an error if it does not exist.
   */
  public async clickMinute(value: string): Promise<void> {
    try {
      await (await this.#getMinutes()).clickButton(value);
    } catch {
      throw new Error(`Unable to find minute button with label "${value}".`);
    }
  }

  /**
   * Gets the current calendar mode.
   */
  public async getSelectorMode(): Promise<string> {
    return (await this.#getMeridies()) ? '12Hr' : '24Hr';
  }

  /**
   * Gets the time value of the currently selected items.
   */
  public async getSelectedValue(): Promise<string | undefined> {
    const hours = await (await this.#getHours()).getSelectedValue();
    const minutes = await (await this.#getMinutes()).getSelectedValue();
    const meridie = await (await this.#getMeridies())?.getSelectedValue();

    return hours + ':' + minutes + (meridie ? ' ' + meridie : '');
  }
}
