import {
  NgModule
} from '@angular/core';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  SkyInfiniteScrollModule
} from '@skyux/lists';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyToastModule
} from '@skyux/toast';

import {
  SkyFlyoutModule
} from './public';

import {
  FlyoutDemoComponent
} from './visual/flyout/flyout-demo.component';

import {
  FlyoutResponsiveDemoComponent
} from './visual/flyout/flyout-responsive-demo.component';

import {
  SkyFlyoutModalDemoComponent
} from './visual/flyout/flyout-modal.component';

@NgModule({
  imports: [
    NoopAnimationsModule,
    SkyInfiniteScrollModule
  ],
  exports: [
    SkyFlyoutModule,
    SkyDropdownModule,
    SkyModalModule,
    SkyToastModule,
    SkyInfiniteScrollModule
  ],
  entryComponents: [
    FlyoutDemoComponent,
    FlyoutResponsiveDemoComponent,
    SkyFlyoutModalDemoComponent
  ]
})
export class AppExtrasModule { }
