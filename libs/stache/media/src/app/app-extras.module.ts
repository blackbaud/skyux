import {
  NgModule
} from '@angular/core';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyHeroModule,
  SkyImageModule,
  SkyVideoModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyHeroModule,
    SkyImageModule,
    SkyVideoModule
  ]
})
export class AppExtrasModule { }
