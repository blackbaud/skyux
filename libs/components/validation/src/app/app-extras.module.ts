import {
  NgModule
} from '@angular/core';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyEmailValidationModule,
  SkyUrlValidationModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyEmailValidationModule,
    SkyUrlValidationModule
  ]
})
export class AppExtrasModule { }
