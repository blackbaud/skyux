import { Pipe, PipeTransform } from '@angular/core';

import { SkyDateRangeCalculatorType } from './types/date-range-calculator-type';

@Pipe({
  name: 'skyDateRangePickerEndDateResourceKey',
})
export class SkyDateRangePickerEndDateResourceKeyPipe implements PipeTransform {
  public transform(
    calculatorType: SkyDateRangeCalculatorType | undefined,
  ): string {
    if (calculatorType === SkyDateRangeCalculatorType.Range) {
      return 'skyux_date_range_picker_end_date_label';
    }

    return 'skyux_date_range_picker_before_date_label';
  }
}
