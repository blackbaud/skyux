import {
  NgModule
} from '@angular/core';

import {
  SkyMediaQueryModule,
  SkyNumericModule
} from './public';

@NgModule({
  imports: [
    SkyMediaQueryModule,
    SkyNumericModule
  ],
  exports: [
    SkyMediaQueryModule,
    SkyNumericModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
