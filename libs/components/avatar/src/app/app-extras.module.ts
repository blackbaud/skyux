import {
  NgModule
} from '@angular/core';

import {
  SkyErrorModule
} from '@skyux/errors';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyAvatarModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyAvatarModule,
    SkyErrorModule
  ]
})
export class AppExtrasModule { }
