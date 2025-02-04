import { NgModule } from '@angular/core';
import { SkyFormErrorModule } from '@skyux/forms';

import { SkyDateRangePickerComponent } from './date-range-picker.component';

@NgModule({
  exports: [SkyDateRangePickerComponent, SkyFormErrorModule],
  imports: [SkyDateRangePickerComponent],
})
export class SkyDateRangePickerModule {}
