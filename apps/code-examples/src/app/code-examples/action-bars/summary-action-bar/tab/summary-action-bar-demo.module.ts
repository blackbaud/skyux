import { NgModule } from '@angular/core';

import { SkyKeyInfoModule } from '@skyux/indicators';

import { SkyTabsModule } from '@skyux/tabs';
import { SkySummaryActionBarModule } from '@skyux/action-bars';

import { SummaryActionBarDemoComponent } from './summary-action-bar-demo.component';

@NgModule({
  imports: [SkyKeyInfoModule, SkyTabsModule, SkySummaryActionBarModule],
  exports: [SummaryActionBarDemoComponent],
  declarations: [SummaryActionBarDemoComponent],
})
export class SummaryActionBarDemoModule {}
