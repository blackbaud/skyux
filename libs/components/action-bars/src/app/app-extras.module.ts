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
  SkyModalModule,
  SkyConfirmModule
} from '@skyux/modals';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkySplitViewModule
} from '@skyux/split-view';

import {
  SkyTabsModule
} from '@skyux/tabs';

import {
  SkySummaryActionBarModule
} from './public/public_api';

import {
  SkySummaryActionBarModalDemoComponent
} from './visual/summary-action-bar/summary-action-bar-modal-demo.component';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyConfirmModule,
    SkyKeyInfoModule,
    SkyModalModule,
    SkySummaryActionBarModule,
    SkyTabsModule,
    SkySplitViewModule,
    NoopAnimationsModule
  ],
  providers: [],
  entryComponents: [
    SkySummaryActionBarModalDemoComponent
  ]
})
export class AppExtrasModule { }
