import {
  NgModule
} from '@angular/core';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyErrorModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyErrorModule
  ]
})
export class AppExtrasModule { }
