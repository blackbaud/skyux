import { ValidationErrors } from '@angular/forms';

import { SkyDateRange } from './date-range';

/**
 * @internal
 */
export type SkyDateRangeCalculatorValidateFunction = (
  value?: SkyDateRange
) => ValidationErrors;
