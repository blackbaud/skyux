import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyDateRangeCalculatorId } from '@skyux/datetime';
import { SkyInputBoxHarness } from '@skyux/forms/testing';

import { SkyDatepickerHarness } from '../datepicker/datepicker-harness';

import { SkyDateRangePickerFilters } from './date-range-picker-harness.filters';

/**
 * Harness for interacting with date range picker components in tests.
 */
export class SkyDateRangePickerHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-date-range-picker';

  #getStartDateInputBoxHarness = this.locatorFor(
    SkyInputBoxHarness.with({
      ancestor: '.sky-date-range-picker-start-date',
    }),
  );
  #getEndDateInputBoxHarness = this.locatorFor(
    SkyInputBoxHarness.with({
      ancestor: '.sky-date-range-picker-end-date',
    }),
  );
  #getCalculatorIdInputBoxHarness = this.locatorFor(
    SkyInputBoxHarness.with({
      ancestor: '.sky-date-range-picker-select-calculator',
    }),
  );

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyDateRangePickerHarness` that meets certain criteria.
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
    await (await this.#getCalculatorIdInputBoxHarness()).clickHelpInline();
  }

  /**
   * Gets the end date value.
   */
  public async getEndDateValue(): Promise<string> {
    if (!(await this.isEndDateVisible())) {
      throw new Error('Unable to get end date. End datepicker is not visible.');
    }

    const input = await (await this.#getEndDatepicker()).getControl();

    return await input.getValue();
  }

  /**
   * Gets the help popover content.
   */
  public async getHelpPopoverContent(): Promise<string | undefined> {
    return (await (
      await this.#getCalculatorIdInputBoxHarness()
    ).getHelpPopoverContent()) as string | undefined;
  }

  /**
   * Gets the help inline popover title.
   */
  public async getHelpPopoverTitle(): Promise<string | undefined> {
    return await (
      await this.#getCalculatorIdInputBoxHarness()
    ).getHelpPopoverTitle();
  }

  /**
   * Gets the hint text.
   */
  public async getHintText(): Promise<string> {
    return await (await this.#getCalculatorIdInputBoxHarness()).getHintText();
  }

  /**
   * Gets the label text.
   */
  public async getLabelText(): Promise<string> {
    return await (await this.#getCalculatorIdInputBoxHarness()).getLabelText();
  }

  /**
   * Gets the selected calculator ID.
   */
  public async getSelectedCalculator(): Promise<SkyDateRangeCalculatorId> {
    const calculatorIdHarness = await this.#getCalculatorIdInputBoxHarness();
    const selectEl = await calculatorIdHarness.querySelector('select');
    const value = await selectEl?.getProperty('value');

    /* istanbul ignore next: safety check */
    if (value === undefined || value === '') {
      throw new Error('No calculator selected.');
    }

    return +value as SkyDateRangeCalculatorId;
  }

  /**
   * Gets the start date value.
   */
  public async getStartDateValue(): Promise<string> {
    if (!(await this.isStartDateVisible())) {
      throw new Error(
        'Unable to get start date. Start datepicker is not visible.',
      );
    }

    const input = await (await this.#getStartDatepicker()).getControl();

    return await input.getValue();
  }

  /**
   * Whether date range picker end date before start date error is thrown.
   */
  public async hasEndDateBeforeStartDateError(): Promise<boolean> {
    return await (
      await this.#getCalculatorIdInputBoxHarness()
    ).hasCustomFormError('endDateBeforeStartDate');
  }

  /**
   * Whether end date input has required error.
   */
  public async hasEndDateRequiredError(): Promise<boolean> {
    return await (await this.#getEndDateInputBoxHarness()).hasRequiredError();
  }

  /**
   * Whether a custom error has fired.
   * @params errorName `errorName` property of the custom `sky-form-error`.
   */
  public async hasError(errorName: string): Promise<boolean> {
    return await (
      await this.#getCalculatorIdInputBoxHarness()
    ).hasCustomFormError(errorName);
  }

  /**
   * Whether start date input has required error.
   */
  public async hasStartDateRequiredError(): Promise<boolean> {
    return await (await this.#getStartDateInputBoxHarness()).hasRequiredError();
  }

  /**
   * Whether the date range picker component is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    return await (await this.#getCalculatorIdInputBoxHarness()).getDisabled();
  }

  /**
   * Whether end date datepicker is visible.
   */
  public async isEndDateVisible(): Promise<boolean> {
    return !(await (
      await this.locatorFor('.sky-date-range-picker-end-date')()
    ).getProperty('hidden'));
  }

  /**
   * Whether the date range picker has stacked enabled.
   */
  public async isStacked(): Promise<boolean> {
    return await (await this.host()).hasClass('sky-form-field-stacked');
  }

  /**
   * Whether start date datepicker is visible.
   */
  public async isStartDateVisible(): Promise<boolean> {
    return !(await (
      await this.locatorFor('.sky-date-range-picker-start-date')()
    ).getProperty('hidden'));
  }

  /**
   * Selects the specified calculator.
   */
  public async selectCalculator(
    calculatorId: SkyDateRangeCalculatorId,
  ): Promise<void> {
    const select = await this.locatorFor(
      'select[FormControlName="calculatorId"',
    )();
    return await select.selectOptions(calculatorId);
  }

  /**
   * Sets the end date.
   * @param newDate date input as a formatted string.
   */
  public async setEndDateValue(newDate: string): Promise<void> {
    if (!(await this.isEndDateVisible())) {
      throw new Error('Unable to set end date. End datepicker is not visible.');
    }
    const input = await (await this.#getEndDatepicker()).getControl();
    await input.setValue(newDate);
  }

  /**
   * Sets the start date.
   * @param newDate date input as a formatted string.
   */
  public async setStartDateValue(newDate: string): Promise<void> {
    if (!(await this.isEndDateVisible())) {
      throw new Error(
        'Unable to set start date. Start datepicker is not visible.',
      );
    }
    const input = await (await this.#getStartDatepicker()).getControl();
    await input.setValue(newDate);
  }

  async #getEndDatepicker(): Promise<SkyDatepickerHarness> {
    return await (
      await this.#getEndDateInputBoxHarness()
    ).queryHarness(SkyDatepickerHarness);
  }

  async #getStartDatepicker(): Promise<SkyDatepickerHarness> {
    return await (
      await this.#getStartDateInputBoxHarness()
    ).queryHarness(SkyDatepickerHarness);
  }
}
