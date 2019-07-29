import {
  NgModule
} from '@angular/core';

import {
  SkyMediaQueryModule
} from '@skyux/core';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyThemeModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyThemeModule,
    SkyMediaQueryModule
  ]
})
export class AppExtrasModule { }
