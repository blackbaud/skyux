import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StatusIndicatorDemoComponent } from './status-indicator-demo.component';

@NgModule({
  imports: [CommonModule],
  exports: [StatusIndicatorDemoComponent],
  declarations: [StatusIndicatorDemoComponent],
})
export class StatusIndicatorDemoModule {}
