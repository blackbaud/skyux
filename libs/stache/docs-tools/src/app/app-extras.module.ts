import {
  NgModule
} from '@angular/core';

import {
  SkyDemoPageModule,
  SkyPropertyDefinitionsModule
} from './public';

@NgModule({
  exports: [
    SkyDemoPageModule,
    SkyPropertyDefinitionsModule
  ]
})
export class AppExtrasModule { }
