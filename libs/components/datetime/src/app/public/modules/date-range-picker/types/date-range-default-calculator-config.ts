import {
  SkyDateRangeCalculatorGetValueFunction
} from './date-range-calculator-date-range-function';

import {
  SkyDateRangeCalculatorId
} from './date-range-calculator-id';

import {
  SkyDateRangeCalculatorType
} from './date-range-calculator-type';

import {
  SkyDateRangeCalculatorValidateFunction
} from './date-range-calculator-validate-function';

export interface SkyDateRangeDefaultCalculatorConfig {

  calculatorId: SkyDateRangeCalculatorId;

  shortDescriptionResourceKey: string;

  type: SkyDateRangeCalculatorType;

  getValue: SkyDateRangeCalculatorGetValueFunction;

  validate?: SkyDateRangeCalculatorValidateFunction;

}
