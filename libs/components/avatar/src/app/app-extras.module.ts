import {
  NgModule
} from '@angular/core';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyAvatarModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyAvatarModule
  ]
})
export class AppExtrasModule { }
