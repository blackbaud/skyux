import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

import { StatusIndicatorDemoComponent } from './status-indicator-demo.component';

@NgModule({
  imports: [CommonModule, SkyStatusIndicatorModule],
  declarations: [StatusIndicatorDemoComponent],
  exports: [StatusIndicatorDemoComponent],
})
export class StatusIndicatorDemoModule {}
