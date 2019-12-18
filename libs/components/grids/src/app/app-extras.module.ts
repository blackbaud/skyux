import {
  NgModule
} from '@angular/core';

import {
  SkyPopoverModule
} from '@skyux/popovers';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyGridModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyGridModule,
    SkyPopoverModule
  ]
})
export class AppExtrasModule { }
