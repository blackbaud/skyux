import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyFlyoutModule } from '@skyux/flyout';

import { FlyoutDemoFlyoutComponent } from './flyout-demo-flyout.component';
import { FlyoutDemoComponent } from './flyout-demo.component';

@NgModule({
  imports: [CommonModule, SkyFlyoutModule],
  declarations: [FlyoutDemoComponent, FlyoutDemoFlyoutComponent],
  exports: [FlyoutDemoComponent],
})
export class FlyoutDemoModule {}
