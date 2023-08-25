import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlyoutDemoFlyoutComponent } from './flyout-demo-flyout.component';
import { FlyoutDemoComponent } from './flyout-demo.component';

@NgModule({
  imports: [CommonModule],
  declarations: [FlyoutDemoComponent, FlyoutDemoFlyoutComponent],
  exports: [FlyoutDemoComponent],
})
export class FlyoutDemoModule {}
