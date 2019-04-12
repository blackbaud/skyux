import {
  SkyDateRangeCalculatorGetValueFunction
} from './date-range-calculator-date-range-function';

import {
  SkyDateRangeCalculatorType
} from './date-range-calculator-type';

import {
  SkyDateRangeCalculatorValidateFunction
} from './date-range-calculator-validate-function';

export interface SkyDateRangeCalculatorConfig {

  /**
   * Text to display within the calculator select menu to represent your calculator.
   */
  shortDescription: string;

  /**
   * Type of calculator you wish to create.
   */
  type: SkyDateRangeCalculatorType;

  /**
   * Callback function that returns a `SkyDateRange` value.
   */
  getValue: SkyDateRangeCalculatorGetValueFunction;

  /**
   * Callback function that accepts user-selected start and end dates.
   * Returning an Angular `ValidationErrors` value will invalidate the date range form control.
   */
  validate?: SkyDateRangeCalculatorValidateFunction;

}
