import {
  NgModule
} from '@angular/core';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyAutonumericModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyAutonumericModule
  ]
})
export class AppExtrasModule { }
