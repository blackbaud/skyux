import {
  NgModule
} from '@angular/core';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyCheckboxModule,
  SkyFileAttachmentsModule,
  SkyRadioModule,
  SkyToggleSwitchModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyCheckboxModule,
    SkyFileAttachmentsModule,
    SkyRadioModule,
    SkyToggleSwitchModule
  ]
})
export class AppExtrasModule { }
