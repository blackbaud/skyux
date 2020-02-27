import {
  NgModule
} from '@angular/core';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyNavbarModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyNavbarModule,
    SkyDropdownModule
  ]
})
export class AppExtrasModule { }
