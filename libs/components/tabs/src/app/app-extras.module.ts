import {
  NgModule
} from '@angular/core';

import {
  SkyCheckboxModule
} from '@skyux/forms';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyTabsModule,
  SkySectionedFormModule,
  SkyVerticalTabsetModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyCheckboxModule,
    SkySectionedFormModule,
    SkyTabsModule,
    SkyVerticalTabsetModule
  ]
})
export class AppExtrasModule { }
