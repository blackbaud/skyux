import {
  NgModule
} from '@angular/core';

import {
  SkyMediaQueryModule
} from '@skyux/core';

import {
  SkyThemeModule
} from './public';

@NgModule({
  exports: [
    SkyThemeModule,
    SkyMediaQueryModule
  ]
})
export class AppExtrasModule { }
