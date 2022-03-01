import { SkyDateRange } from './date-range';
import { SkyDateRangeCalculatorId } from './date-range-calculator-id';

/**
 * Represents the returned value of a `SkyDateRangeCalculator`.
 */
export interface SkyDateRangeCalculation extends SkyDateRange {
  /**
   * Specifies the calculator that determines the dates in the date range.
   */
  calculatorId: SkyDateRangeCalculatorId;
}
