import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyFlyoutModule
} from '@skyux/flyout';

import {
  FlyoutDemoComponent
} from './flyout-demo.component';

import {
  FlyoutDemoFlyoutComponent
} from './flyout-demo-flyout.component';

@NgModule({
  imports: [
    CommonModule,
    SkyFlyoutModule
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
