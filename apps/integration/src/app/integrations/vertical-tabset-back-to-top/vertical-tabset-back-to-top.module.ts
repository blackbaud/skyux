import { NgModule } from '@angular/core';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyBackToTopModule } from '@skyux/layout';
import { SkyVerticalTabsetModule } from '@skyux/tabs';

import { VerticalTabsetBackToTopRoutingModule } from './vertical-tabset-back-to-top-routing.module';
import { VerticalTabsetBackToTopComponent } from './vertical-tabset-back-to-top.component';

@NgModule({
  declarations: [VerticalTabsetBackToTopComponent],
  imports: [
    SkyBackToTopModule,
    SkySummaryActionBarModule,
    SkyVerticalTabsetModule,
    VerticalTabsetBackToTopRoutingModule,
  ],
})
export class VerticalTabsetBackToTopModule {
  public static routes = VerticalTabsetBackToTopRoutingModule.routes;
}
