import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyKeyInfoModule } from '@skyux/indicators';

import { SummaryActionBarDemoComponent } from './summary-action-bar-demo.component';

@NgModule({
  imports: [CommonModule, SkyKeyInfoModule, SkySummaryActionBarModule],
  exports: [SummaryActionBarDemoComponent],
  declarations: [SummaryActionBarDemoComponent],
})
export class SummaryActionBarDemoModule {}
