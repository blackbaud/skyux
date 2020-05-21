import {
  NgModule
} from '@angular/core';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkySelectFieldModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkySelectFieldModule
  ]
})
export class AppExtrasModule { }
