import { NgModule } from '@angular/core';

import { SkyKeyInfoModule } from '@skyux/indicators';

import { SkyTabsModule } from '@skyux/tabs';
import { SkySummaryActionBarModule } from 'projects/action-bars/src/public-api';

import { SummaryActionBarDemoComponent } from './summary-action-bar-demo.component';

@NgModule({
  imports: [SkyKeyInfoModule, SkyTabsModule, SkySummaryActionBarModule],
  exports: [SummaryActionBarDemoComponent],
  declarations: [SummaryActionBarDemoComponent],
})
export class SummaryActionBarDemoModule {}
