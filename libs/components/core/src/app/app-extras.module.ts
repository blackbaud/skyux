import {
  NgModule
} from '@angular/core';

import {
  SkyMediaQueryDemoModule,
  SkyNumericDemoModule
} from './public';

require('style-loader!./public/styles/sky.scss');

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
