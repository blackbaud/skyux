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
} from './public/public_api';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyHeroModule,
    SkyImageModule,
    SkyVideoModule
  ]
})
export class AppExtrasModule { }
