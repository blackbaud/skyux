import { SkyDateRange } from './date-range';

export type SkyDateRangeCalculatorGetValueFunction = (
  startDateInput?: Date | null,
  endDateInput?: Date | null
) => SkyDateRange;
