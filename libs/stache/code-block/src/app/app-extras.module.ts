import {
  NgModule
} from '@angular/core';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyCodeBlockModule,
  SkyCodeModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyCodeBlockModule,
    SkyCodeModule
  ]
})
export class AppExtrasModule { }
