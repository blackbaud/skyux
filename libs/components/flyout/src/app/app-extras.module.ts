import {
  NgModule
} from '@angular/core';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyFlyoutModule,
  SkyFlyoutService
} from './public';

import {
  FlyoutDemoComponent
} from './visual/flyout/flyout-demo.component';

@NgModule({
  imports: [
    NoopAnimationsModule,
    SkyFlyoutModule,
    SkyDropdownModule
  ],
  exports: [
    SkyFlyoutModule,
    SkyDropdownModule
  ],
  providers: [
    SkyFlyoutService
  ],
  entryComponents: [
    FlyoutDemoComponent
  ]
})
export class AppExtrasModule { }
