import { NgModule } from '@angular/core';
import { SkySummaryActionBarModule } from '@skyux/action-bars';

import { SummaryActionBarRoutingModule } from './summary-action-bar-routing.module';
import { SummaryActionBarComponent } from './summary-action-bar.component';

@NgModule({
  declarations: [SummaryActionBarComponent],
  imports: [SkySummaryActionBarModule, SummaryActionBarRoutingModule],
})
export class SummaryActionBarModule {
  public static routes = SummaryActionBarRoutingModule.routes;
}
