import {
  NgModule
} from '@angular/core';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyGridModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyGridModule
  ]
})
export class AppExtrasModule { }
