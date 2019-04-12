import {
  ValidationErrors
} from '@angular/forms';

import {
  SkyDateRange
} from './date-range';

export type SkyDateRangeCalculatorValidateFunction = (value?: SkyDateRange) => ValidationErrors;
