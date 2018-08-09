import {
  NgModule
} from '@angular/core';

import {
  SkyMediaQueryDemoModule,
  SkyNumericDemoModule
} from './public';

@NgModule({
  imports: [
    SkyMediaQueryDemoModule,
    SkyNumericDemoModule
  ],
  exports: [
    SkyMediaQueryDemoModule,
    SkyNumericDemoModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
