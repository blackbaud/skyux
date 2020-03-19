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
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyAvatarModule,
    SkyErrorModule
  ]
})
export class AppExtrasModule { }
