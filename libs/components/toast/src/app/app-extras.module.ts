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
  SkyToastModule
} from './public/public_api';

import {
  ToastDemoComponent
} from './visual/toast/toast-demo.component';

@NgModule({
  imports: [
    SkyToastModule,
    NoopAnimationsModule
  ],
  exports: [
    SkyAppLinkModule,
    SkyToastModule
  ],
  entryComponents: [
    ToastDemoComponent
  ]
})
export class AppExtrasModule { }
