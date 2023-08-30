import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlyoutDemoComponent } from './flyout-demo.component';

@NgModule({
  imports: [CommonModule],
  declarations: [FlyoutDemoComponent],
  exports: [FlyoutDemoComponent],
})
export class FlyoutDemoModule {}
