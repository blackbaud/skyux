import { ValidationErrors } from '@angular/forms';

import { SkyDateRange } from './date-range';
import { SkyDateRangeCalculation } from './date-range-calculation';
import { SkyDateRangeCalculatorConfig } from './date-range-calculator-config';
import { SkyDateRangeCalculatorId } from './date-range-calculator-id';
import { SkyDateRangeCalculatorType } from './date-range-calculator-type';

/**
 * Represents the calculator.
 */
export class SkyDateRangeCalculator {
  /**
   * Specifies the text to display in the calculator select menu.
   */
  public readonly shortDescription: string;

  /**
   * Specifies the type of calculations available for the date range.
   */
  public readonly type: SkyDateRangeCalculatorType;

  constructor(
    /**
     * Provides a calculator ID to specify calculator objects that represent date ranges.
     */
    public readonly calculatorId: SkyDateRangeCalculatorId,
    private config: SkyDateRangeCalculatorConfig
  ) {
    this.type = config.type;
    this.shortDescription = config.shortDescription;
  }

  /**
   * Gets the current value of the calculator.
   * @param startDateInput The start date.
   * @param endDateInput The end date.
   */
  public getValue(
    startDateInput?: Date,
    endDateInput?: Date
  ): SkyDateRangeCalculation {
    const result = this.config.getValue(startDateInput, endDateInput);

    let startDate: Date = null;
    if (result.startDate instanceof Date) {
      startDate = this.parseDateWithoutTime(result.startDate);
    }

    let endDate: Date = null;
    if (result.endDate instanceof Date) {
      endDate = this.parseDateWithoutTime(result.endDate);
    }

    return {
      calculatorId: this.calculatorId,
      startDate,
      endDate,
    };
  }

  /**
   * Performs synchronous validation against the control.
   */
  public validate(value?: SkyDateRange): ValidationErrors {
    if (!this.config.validate) {
      return;
    }

    return this.config.validate(value);
  }

  /**
   * Get a date object without time information.
   * See: https://stackoverflow.com/a/38050824/6178885
   */
  private parseDateWithoutTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
