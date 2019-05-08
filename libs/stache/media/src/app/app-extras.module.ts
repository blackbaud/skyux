import {
  NgModule
} from '@angular/core';

import {
  SkyHeroModule,
  SkyImageModule,
  SkyVideoModule
} from './public';

@NgModule({
  exports: [
    SkyHeroModule,
    SkyImageModule,
    SkyVideoModule
  ]
})
export class AppExtrasModule { }
