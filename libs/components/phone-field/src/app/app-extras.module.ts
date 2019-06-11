import {
  NgModule
} from '@angular/core';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  SkyPhoneFieldModule
} from './public';

@NgModule({
  exports: [
    SkyPhoneFieldModule,
    NoopAnimationsModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
