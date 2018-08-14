import {
  NgModule
} from '@angular/core';

import {
  SkyMediaQueryModule,
  SkyNumericModule
} from './public';

import { SkyAppRuntimeModule } from '@blackbaud/skyux-builder/runtime';

@NgModule({
  imports: [
    SkyAppRuntimeModule,
    SkyMediaQueryModule,
    SkyNumericModule
  ],
  exports: [
    SkyAppRuntimeModule,
    SkyMediaQueryModule,
    SkyNumericModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
