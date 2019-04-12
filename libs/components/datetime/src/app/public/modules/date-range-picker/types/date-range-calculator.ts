import {
  ValidationErrors
} from '@angular/forms';

import {
  SkyDateRangeCalculation
} from './date-range-calculation';

import {
  SkyDateRangeCalculatorConfig
} from './date-range-calculator-config';

import {
  SkyDateRangeCalculatorId
} from './date-range-calculator-id';

import {
  SkyDateRangeCalculatorType
} from './date-range-calculator-type';

import {
  SkyDateRange
} from './date-range';

export class SkyDateRangeCalculator {
  public readonly shortDescription: string;
  public readonly type: SkyDateRangeCalculatorType;

  constructor(
    public readonly calculatorId: SkyDateRangeCalculatorId,
    private config: SkyDateRangeCalculatorConfig
  ) {
    this.type = config.type;
    this.shortDescription = config.shortDescription;
  }

  public getValue(startDateInput?: Date, endDateInput?: Date): SkyDateRangeCalculation {

    const result = this.config.getValue(startDateInput, endDateInput);

    /* tslint:disable:no-null-keyword */
    // (Angular form controls use null for the "empty" value.)

    let startDate: Date = null;
    if (result.startDate instanceof Date) {
      startDate = this.parseDateWithoutTime(result.startDate);
    }

    let endDate: Date = null;
    if (result.endDate instanceof Date) {
      endDate = this.parseDateWithoutTime(result.endDate);
    }

    /* tslint:enable */

    return {
      calculatorId: this.calculatorId,
      startDate,
      endDate
    };
  }

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
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }
}
