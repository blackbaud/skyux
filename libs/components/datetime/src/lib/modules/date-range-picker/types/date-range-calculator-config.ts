import { SkyDateRangeCalculatorGetValueFunction } from './date-range-calculator-date-range-function';

import { SkyDateRangeCalculatorType } from './date-range-calculator-type';

import { SkyDateRangeCalculatorValidateFunction } from './date-range-calculator-validate-function';

/**
 * The configuration for a date range calculator.
 */
export interface SkyDateRangeCalculatorConfig {
  /**
   * Text to display within the calculator select menu to represent your calculator.
   */
  shortDescription: string;

  /**
   * The type of calculator to create.
   */
  type: SkyDateRangeCalculatorType;

  /**
   * A callback function that returns a `SkyDateRange` value.
   */
  getValue: SkyDateRangeCalculatorGetValueFunction;

  /**
   * A callback function that accepts user-selected start and end dates.
   * Returning an Angular `ValidationErrors` value invalidates the date range form control.
   */
  validate?: SkyDateRangeCalculatorValidateFunction;
}
