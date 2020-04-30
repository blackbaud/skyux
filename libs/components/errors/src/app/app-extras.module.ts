import {
  NgModule
} from '@angular/core';

import {
  SkyPageModule
} from '@skyux/layout';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyErrorModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyErrorModule,
    SkyPageModule
  ]
})
export class AppExtrasModule { }
