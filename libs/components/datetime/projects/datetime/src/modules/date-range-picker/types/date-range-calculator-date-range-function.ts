import {
  SkyDateRange
} from './date-range';

/**
 * @internal
 */
export type SkyDateRangeCalculatorGetValueFunction = (
  startDateInput?: Date,
  endDateInput?: Date
) => SkyDateRange;
