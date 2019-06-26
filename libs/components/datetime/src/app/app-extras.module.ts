import {
  NgModule
} from '@angular/core';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyDatePipeModule,
  SkyDatepickerModule,
  SkyDateRangePickerModule,
  SkyTimepickerModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyDatePipeModule,
    SkyDatepickerModule,
    SkyTimepickerModule,
    SkyDateRangePickerModule
  ]
})
export class AppExtrasModule { }
