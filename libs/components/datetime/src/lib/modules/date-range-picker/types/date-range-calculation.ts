import { SkyDateRangeCalculatorId } from './date-range-calculator-id';

/**
 * Represents the returned value of a `SkyDateRangeCalculator`.
 */
export interface SkyDateRangeCalculation {
  /**
   * The calculator that determines the dates in the date range.
   */
  calculatorId: SkyDateRangeCalculatorId;

  /**
   * The last date in the date range.
   */
  endDate?: Date | string | null;

  /**
   * The first date in the date range.
   */
  startDate?: Date | string | null;
}
