import { NgModule } from '@angular/core';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyKeyInfoModule } from '@skyux/indicators';
import { SkyBackToTopModule } from '@skyux/layout';

import { SummaryActionBarRoutingModule } from './summary-action-bar-routing.module';
import { SummaryActionBarComponent } from './summary-action-bar.component';

@NgModule({
  declarations: [SummaryActionBarComponent],
  imports: [
    SkySummaryActionBarModule,
    SkyBackToTopModule,
    SummaryActionBarRoutingModule,
    SkyKeyInfoModule,
  ],
})
export class SummaryActionBarModule {
  public static routes = SummaryActionBarRoutingModule.routes;
}
