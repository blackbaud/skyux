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
  SkyCharacterCounterModule,
  SkyToggleSwitchModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyCheckboxModule,
    SkyFileAttachmentsModule,
    SkyRadioModule,
    SkyCharacterCounterModule,
    SkyToggleSwitchModule
  ]
})
export class AppExtrasModule { }
