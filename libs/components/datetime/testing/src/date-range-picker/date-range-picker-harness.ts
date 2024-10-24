import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyDatepickerHarness } from '@skyux/datetime/testing';
import { SkyFormErrorsHarness, SkyInputBoxHarness } from '@skyux/forms/testing';

import { SkyDateRangePickerCalculatorOptionHarness } from './date-range-picker-calculator-option-harness';
import { SkyDateRangePickerCalculatorOptionHarnessFilters } from './date-range-picker-calculator-option-harness.filters';
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
   * Selects a calculator based on its name.
   */
  public async selectCalculator(calculatorName: string): Promise<void> {
    const option = await this.locatorForOptional(
      SkyDateRangePickerCalculatorOptionHarness.with({ text: calculatorName }),
    )();

    if (!option) {
      throw new Error(`Unable to find calculator "${calculatorName}".`);
    }

    return await option.click();
  }
}
