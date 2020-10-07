import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyAvatarModule
} from '@skyux/avatar';

import {
  SkyFlyoutModule
} from '@skyux/flyout';

import {
  SkyKeyInfoModule,
  SkyLabelModule
} from '@skyux/indicators';

import {
  SkyPageSummaryModule
} from '@skyux/layout';

import {
  SkyListModule
} from '@skyux/list-builder';

import {
  SkyListViewGridModule
} from '@skyux/list-builder-view-grids';

import {
  FlyoutDemoComponent
} from './flyout-demo.component';

import {
  FlyoutDemoFlyoutComponent
} from './flyout-demo-flyout.component';

@NgModule({
  imports: [
    CommonModule,
    SkyAvatarModule,
    SkyFlyoutModule,
    SkyListModule,
    SkyKeyInfoModule,
    SkyLabelModule,
    SkyListViewGridModule,
    SkyPageSummaryModule
  ],
  declarations: [
    FlyoutDemoComponent,
    FlyoutDemoFlyoutComponent
  ],
  entryComponents: [
    FlyoutDemoFlyoutComponent
  ],
  exports: [
    FlyoutDemoComponent
  ]
})
export class AutocompleteDemoModule { }
