import {
  NgModule
} from '@angular/core';

import {
  SkyDatepickerModule,
  SkyDatePipeModule,
  SkyTimepickerModule
} from './public';

@NgModule({
  exports: [
    SkyDatepickerModule,
    SkyDatePipeModule,
    SkyTimepickerModule
  ]
})
export class AppExtrasModule { }
