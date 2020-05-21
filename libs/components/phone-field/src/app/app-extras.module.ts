import {
  NgModule
} from '@angular/core';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyPhoneFieldModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyPhoneFieldModule,
    NoopAnimationsModule
  ]
})
export class AppExtrasModule { }
