import {
  NgModule
} from '@angular/core';

import {
  SkyDatePipeModule,
  SkyDatepickerModule,
  SkyDateRangePickerModule,
  SkyTimepickerModule
} from './public';

@NgModule({
  exports: [
    SkyDatePipeModule,
    SkyDatepickerModule,
    SkyTimepickerModule,
    SkyDateRangePickerModule
  ]
})
export class AppExtrasModule { }
