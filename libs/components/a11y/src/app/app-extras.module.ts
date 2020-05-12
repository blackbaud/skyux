import {
  NgModule
} from '@angular/core';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkySkipLinkModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkySkipLinkModule
  ]
})
export class AppExtrasModule { }
