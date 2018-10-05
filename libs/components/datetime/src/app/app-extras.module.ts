import {
  NgModule
} from '@angular/core';

import {
  SkyDatepickerModule,
  SkyTimepickerModule
} from './public';

@NgModule({
  imports: [
    SkyDatepickerModule,
    SkyTimepickerModule
  ],
  exports: [
    SkyDatepickerModule,
    SkyTimepickerModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
