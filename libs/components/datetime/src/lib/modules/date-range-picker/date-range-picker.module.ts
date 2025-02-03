import { NgModule } from '@angular/core';
import { SkyFormErrorModule } from '@skyux/forms';

import { SkyDateRangePickerComponent } from './date-range-picker.component';

/**
 * @docsIncludeIds SkyDateRangePickerComponent, SkyDateRangeService, SkyDateRange, SkyDateRangeCalculation, SkyDateRangeCalculator, SkyDateRangeCalculatorConfig, SkyDateRangeCalculatorId, SkyDateRangeCalculatorType, SkyDateRangeCalculatorGetValueFunction, SkyDateRangeCalculatorValidateFunction, SkyDateRangePickerHarness, SkyDateRangePickerFilters, DatetimeDateRangePickerBasicExampleComponent, DatetimeDateRangePickerHelpKeyExampleComponent, DatetimeDateRangePickerCustomCalculatorExampleComponent
 */
@NgModule({
  exports: [SkyDateRangePickerComponent, SkyFormErrorModule],
  imports: [SkyDateRangePickerComponent],
})
export class SkyDateRangePickerModule {}
