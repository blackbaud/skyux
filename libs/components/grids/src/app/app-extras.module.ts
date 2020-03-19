import {
  NgModule
} from '@angular/core';

import {
  SkyDropdownModule,
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
    SkyDropdownModule,
    SkyGridModule,
    SkyPopoverModule
  ]
})
export class AppExtrasModule { }
