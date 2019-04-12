import {
  SkyDateRangeCalculatorId
} from './date-range-calculator-id';

import {
  SkyDateRange
} from './date-range';

export interface SkyDateRangeCalculation extends SkyDateRange {
  calculatorId: SkyDateRangeCalculatorId;
}
