import {
  SkyDateRange
} from './date-range';

export type SkyDateRangeCalculatorGetValueFunction = (
  startDateInput?: Date,
  endDateInput?: Date
) => SkyDateRange;
