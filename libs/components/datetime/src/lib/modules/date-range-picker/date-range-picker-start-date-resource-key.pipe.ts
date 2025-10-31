import { Pipe, PipeTransform } from '@angular/core';

import { SkyDateRangeCalculatorType } from './types/date-range-calculator-type';

@Pipe({
  name: 'skyDateRangePickerStartDateResourceKey',
})
export class SkyDateRangePickerStartDateResourceKeyPipe
  implements PipeTransform
{
  public transform(
    calculatorType: SkyDateRangeCalculatorType | undefined,
  ): string {
    if (calculatorType === SkyDateRangeCalculatorType.Range) {
      return 'skyux_date_range_picker_start_date_label';
    }

    return 'skyux_date_range_picker_after_date_label';
  }
}
