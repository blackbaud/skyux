import {
  NgModule
} from '@angular/core';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyCodeBlockModule,
  SkyCodeModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyCodeBlockModule,
    SkyCodeModule
  ]
})
export class AppExtrasModule { }
