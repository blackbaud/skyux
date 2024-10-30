import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyDateRangeCalculatorId } from '@skyux/datetime';
import { SkyInputBoxHarness } from '@skyux/forms/testing';

import { isDate } from 'moment';

import { SkyDatepickerHarness } from '../public-api';

import { SkyDateRangePickerFilters } from './date-range-picker-harness.filters';

/**
 * Harness for interacting with date range picker components in tests.
 */
export class SkyDateRangePickerHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-date-range-picker';

  #getStartDateInput = this.locatorFor(
    SkyInputBoxHarness.with({
      ancestor: '.sky-date-range-picker-start-date',
    }),
  );
  #getEndDateInput = this.locatorFor(
    SkyInputBoxHarness.with({
      ancestor: '.sky-date-range-picker-end-date',
    }),
  );
  #getCalculatorSelectInput = this.locatorFor(
    SkyInputBoxHarness.with({
      ancestor: '.sky-date-range-picker-select-field',
    }),
  );
  #getCalculatorSelect = this.locatorFor(
    'select[FormControlName="calculatorId"',
  );

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyDatepickerHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyDateRangePickerFilters,
  ): HarnessPredicate<SkyDateRangePickerHarness> {
    return SkyDateRangePickerHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the help inline button.
   */
  public async clickHelpInline(): Promise<void> {
    return await (await this.#getCalculatorSelectInput()).clickHelpInline();
  }

  /**
   * Gets the help popover content.
   */
  public async getHelpPopoverContent(): Promise<string | undefined> {
    return (await (
      await this.#getCalculatorSelectInput()
    ).getHelpPopoverContent()) as string | undefined;
  }

  /**
   * Gets the help inline popover title.
   */
  public async getHelpPopoverTitle(): Promise<string | undefined> {
    return await (await this.#getCalculatorSelectInput()).getHelpPopoverTitle();
  }

  /**
   * Gets the date range picker component's hint text.
   */
  public async getHintText(): Promise<string> {
    return await (await this.#getCalculatorSelectInput()).getHintText();
  }

  /**
   * Gets the date range picker component's label text.
   */
  public async getLabelText(): Promise<string> {
    return (await this.#getCalculatorSelectInput()).getLabelText();
  }

  /**
   * Whether date range picker end date before start date error is thrown.
   */
  public async hasEndDateBeforeStartDateError(): Promise<boolean> {
    return (await this.#getCalculatorSelectInput()).hasCustomFormError(
      'endDateBeforeStartDate',
    );
  }

  /**
   * Whether end date input has required error.
   */
  public async hasEndDateRequiredError(): Promise<boolean> {
    return (await this.#getEndDateInput()).hasRequiredError();
  }

  /**
   * Whether the custom error has fired.
   * @params errorName `errorName` of the custom error.
   */
  public async hasError(errorName: string): Promise<boolean> {
    return (await this.#getCalculatorSelectInput()).hasCustomFormError(
      errorName,
    );
  }

  /**
   * Whether start date input has required error.
   */
  public async hasStartDateRequiredError(): Promise<boolean> {
    return (await this.#getStartDateInput()).hasRequiredError();
  }

  /**
   * Whether the date range picker component is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    return (await this.#getCalculatorSelectInput()).getDisabled();
  }

  /**
   * Whether end date datepicker is visible.
   */
  public async isEndDateVisible(): Promise<boolean> {
    return !(
      await this.locatorFor('.sky-date-range-picker-end-date')()
    ).getProperty('hidden');
  }

  /**
   * Whether the date range picker has stacked enabled.
   */
  public async isStacked(): Promise<boolean> {
    return (await this.host()).hasClass('sky-margin-stacked-lg');
  }

  /**
   * Whether start date datepicker is visible.
   */
  public async isStartDateVisible(): Promise<boolean> {
    return !(
      await this.locatorFor('.sky-date-range-picker-start-date')()
    ).getProperty('hidden');
  }

  /**
   * Selects the specified calculator.
   */
  public async selectCalculator(
    calculatorId: SkyDateRangeCalculatorId,
  ): Promise<void> {
    const select = await this.#getCalculatorSelect();
    return select.selectOptions(calculatorId);
  }

  /**
   * Sets the end date.
   */
  public async setEndDate(newDate: Date | string): Promise<void> {
    if (isDate(newDate)) {
      newDate = newDate.toDateString();
    }
    const input = await (await this.#getEndDatepicker()).getControl();

    await input.setValue(newDate);
    console.log('HERE: ' + (await input.getValue()));
  }

  /**
   * Sets the start date.
   */
  public async setStartDate(newDate: Date | string): Promise<void> {
    if (isDate(newDate)) {
      newDate = newDate.toDateString();
    }
    const input = await (await this.#getStartDatepicker()).getControl();
    await input.setValue(newDate);
    console.log('HERE2: ' + (await input.getValue()));
  }

  async #getEndDatepicker(): Promise<SkyDatepickerHarness> {
    return (await this.#getEndDateInput()).queryHarness(SkyDatepickerHarness);
  }

  async #getStartDatepicker(): Promise<SkyDatepickerHarness> {
    return (await this.#getStartDateInput()).queryHarness(SkyDatepickerHarness);
  }
}
