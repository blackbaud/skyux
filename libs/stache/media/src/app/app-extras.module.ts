import {
  NgModule
} from '@angular/core';

import {
  SkyHeroModule,
  SkyImageModule
} from './public';

@NgModule({
  imports: [],
  exports: [
    SkyHeroModule,
    SkyImageModule
  ]
})
export class AppExtrasModule { }
