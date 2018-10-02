import {
  NgModule
} from '@angular/core';

import {
  SkyCheckboxModule,
  SkyFileAttachmentsModule,
  SkyRadioModule
} from './public';

@NgModule({
  imports: [
    SkyCheckboxModule,
    SkyFileAttachmentsModule,
    SkyRadioModule
  ],
  exports: [
    SkyCheckboxModule,
    SkyFileAttachmentsModule,
    SkyRadioModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
