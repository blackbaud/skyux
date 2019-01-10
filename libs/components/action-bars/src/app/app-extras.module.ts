import {
  NgModule
} from '@angular/core';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  SkyKeyInfoModule
} from '@skyux/indicators';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  SkySummaryActionBarModule
} from './public';

import {
  SkySummaryActionBarModalDemoComponent
} from './visual/summary-action-bar/summary-action-bar-modal-demo.component';

@NgModule({
  imports: [
    SkyKeyInfoModule,
    SkyModalModule,
    SkySummaryActionBarModule,
    NoopAnimationsModule
  ],
  exports: [
    SkyKeyInfoModule,
    SkyModalModule,
    SkySummaryActionBarModule,
    NoopAnimationsModule
  ],
  providers: [],
  entryComponents: [
    SkySummaryActionBarModalDemoComponent
  ]
})
export class AppExtrasModule { }
