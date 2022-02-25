import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyFlyoutModule } from 'projects/flyout/src/public-api';

import { FlyoutDemoComponent } from './flyout-demo.component';

import { FlyoutDemoFlyoutComponent } from './flyout-demo-flyout.component';

@NgModule({
  imports: [CommonModule, SkyFlyoutModule],
  declarations: [FlyoutDemoComponent, FlyoutDemoFlyoutComponent],
  entryComponents: [FlyoutDemoFlyoutComponent],
  exports: [FlyoutDemoComponent],
})
export class AutocompleteDemoModule {}
