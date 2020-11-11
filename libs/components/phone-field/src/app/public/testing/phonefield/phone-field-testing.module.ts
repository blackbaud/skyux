import {
  NgModule
} from '@angular/core';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  SkyPhoneFieldModule
} from '@skyux/phone-field';

@NgModule({
  exports: [
    SkyPhoneFieldModule,

    // The noop animations module needs to be loaded last to avoid
    // subsequent modules adding animations and overriding this.
    NoopAnimationsModule
  ]
})
export class SkyPhoneFieldTestingModule { }
