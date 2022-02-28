import { NgModule } from '@angular/core';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyKeyInfoModule } from '@skyux/indicators';
import { SkyTabsModule } from '@skyux/tabs';

import { SummaryActionBarDemoComponent } from './summary-action-bar-demo.component';

@NgModule({
  imports: [SkyKeyInfoModule, SkyTabsModule, SkySummaryActionBarModule],
  exports: [SummaryActionBarDemoComponent],
  declarations: [SummaryActionBarDemoComponent],
})
export class SummaryActionBarDemoModule {}
