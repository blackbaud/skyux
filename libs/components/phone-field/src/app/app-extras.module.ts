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
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyPhoneFieldModule,
    NoopAnimationsModule
  ]
})
export class AppExtrasModule { }
