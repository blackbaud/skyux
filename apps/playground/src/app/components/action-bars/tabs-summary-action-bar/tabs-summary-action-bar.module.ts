import { NgModule } from '@angular/core';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyKeyInfoModule } from '@skyux/indicators';
import { SkyTabsModule } from '@skyux/tabs';

import { TabsSummaryActionBarRoutingModule } from './tabs-summary-action-bar-routing.module';
import { TabsSummaryActionBarComponent } from './tabs-summary-action-bar.component';

@NgModule({
  declarations: [TabsSummaryActionBarComponent],
  imports: [
    SkyKeyInfoModule,
    SkySummaryActionBarModule,
    SkyTabsModule,
    TabsSummaryActionBarRoutingModule,
  ],
})
export class TabsSummaryActionBarModule {}
