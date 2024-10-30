import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyDateRangeCalculatorId } from '@skyux/datetime';
import { SkyInputBoxHarness } from '@skyux/forms/testing';

import { isDate } from 'moment';

import { SkyDatepickerHarness } from '../public-api';

import { SkyDateRangePickerFilters } from './date-range-picker-harness.filters';

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
   * Gets the start date datepicker.
   */
  public async getStartDatepicker(): Promise<SkyDatepickerHarness> {
    return (await this.#getStartDateInput()).queryHarness(SkyDatepickerHarness);
  }

  /**
   * Gets the end date datepicker.
   */
  public async getEndDatepicker(): Promise<SkyDatepickerHarness> {
    return (await this.#getEndDateInput()).queryHarness(SkyDatepickerHarness);
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
   * Whether end date input has required error.
   */
  public async hasEndDateRequiredError(): Promise<boolean> {
    return (await this.#getEndDateInput()).hasRequiredError();
  }

  /**
   * Whether the date range picker component is disabled
   */
  public async isDisabled(): Promise<boolean> {
    return (await this.#getCalculatorSelectInput()).getDisabled();
  }

  /**
   * Selects the specified calculator.
   */
  public async selectCalculator(
    calculatorId: SkyDateRangeCalculatorId,
  ): Promise<void> {
    const select = await this.#getCalculatorSelect();
    return select.setInputValue(calculatorId.toString());
  }

  /**
   * Sets the start date.
   */
  public async setStartDate(newDate: Date | string): Promise<void> {
    if (isDate(newDate)) {
      newDate = newDate.toDateString();
    }
    return (await this.getStartDatepicker()).setValue(newDate);
  }

  /**
   * Sets the end date.
   */
  public async setEndDate(newDate: Date | string): Promise<void> {
    if (isDate(newDate)) {
      newDate = newDate.toDateString();
    }
    return (await this.getEndDatepicker()).setValue(newDate);
  }
}
